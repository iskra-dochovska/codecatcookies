create table packaging_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  created_at timestamptz not null default now()
);

create table order_packaging (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  packaging_item_id uuid references packaging_items(id) on delete set null,
  packaging_item_name text not null,
  quantity integer not null,
  unit_price numeric not null
);

create index order_packaging_order_id_idx on order_packaging(order_id);

alter table packaging_items enable row level security;
alter table order_packaging enable row level security;

create policy "authenticated full access to packaging_items" on packaging_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access to order_packaging" on order_packaging
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
