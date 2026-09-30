create table merch (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price integer not null,
  image_path text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table merch enable row level security;

create policy "anyone can read active merch" on merch
  for select using (active = true);

create policy "authenticated full access to merch" on merch
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('merch-images', 'merch-images', true)
on conflict (id) do nothing;

create policy "public can read merch-images bucket" on storage.objects
  for select using (bucket_id = 'merch-images');

create policy "authenticated can upload merch-images" on storage.objects
  for insert with check (bucket_id = 'merch-images' and auth.role() = 'authenticated');

create policy "authenticated can update merch-images" on storage.objects
  for update using (bucket_id = 'merch-images' and auth.role() = 'authenticated');

create policy "authenticated can delete merch-images" on storage.objects
  for delete using (bucket_id = 'merch-images' and auth.role() = 'authenticated');

create table order_merch_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  merch_slug text not null,
  merch_name text not null,
  quantity integer not null,
  unit_price integer not null
);

create index order_merch_items_order_id_idx on order_merch_items(order_id);

alter table order_merch_items enable row level security;

create policy "authenticated can read order_merch_items" on order_merch_items
  for select using (auth.role() = 'authenticated');

create policy "authenticated can insert order_merch_items" on order_merch_items
  for insert with check (auth.role() = 'authenticated');

drop function if exists create_order(jsonb, jsonb, text);

create or replace function create_order(order_data jsonb, items jsonb, promo_code text default null, merch_items jsonb default '[]'::jsonb)
returns jsonb
language plpgsql
as $$
declare
  new_order_id uuid;
  applied_discount boolean := false;
  promo_id uuid;
begin
  if promo_code is not null and btrim(promo_code) <> '' then
    select id into promo_id
    from promo_codes
    where lower(code) = lower(btrim(promo_code))
      and active
      and (max_uses is null or uses < max_uses)
    for update;

    if promo_id is null then
      raise exception 'invalid_promo_code';
    end if;

    update promo_codes set uses = uses + 1 where id = promo_id;
    applied_discount := true;
  end if;

  insert into orders (full_name, email, phone, pickup_date, pickup_time, notes, total, discount)
  values (
    order_data->>'full_name',
    order_data->>'email',
    order_data->>'phone',
    (order_data->>'pickup_date')::date,
    order_data->>'pickup_time',
    order_data->>'notes',
    (order_data->>'total')::integer,
    applied_discount
  )
  returning id into new_order_id;

  insert into order_items (order_id, cookie_slug, cookie_name, quantity, unit_price, unit_cost)
  select
    new_order_id,
    item->>'cookie_slug',
    item->>'cookie_name',
    (item->>'quantity')::integer,
    (item->>'unit_price')::integer,
    (item->>'unit_cost')::numeric
  from jsonb_array_elements(items) as item;

  insert into order_merch_items (order_id, merch_slug, merch_name, quantity, unit_price)
  select
    new_order_id,
    item->>'merch_slug',
    item->>'merch_name',
    (item->>'quantity')::integer,
    (item->>'unit_price')::integer
  from jsonb_array_elements(merch_items) as item;

  return jsonb_build_object('order_id', new_order_id, 'discount_applied', applied_discount);
end;
$$;

revoke all on function create_order(jsonb, jsonb, text, jsonb) from public, anon, authenticated;
grant execute on function create_order(jsonb, jsonb, text, jsonb) to service_role, authenticated;
