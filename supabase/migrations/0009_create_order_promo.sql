drop function if exists create_order(jsonb, jsonb);

create or replace function create_order(order_data jsonb, items jsonb, promo_code text default null)
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

  return jsonb_build_object('order_id', new_order_id, 'discount_applied', applied_discount);
end;
$$;

revoke all on function create_order(jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function create_order(jsonb, jsonb, text) to service_role;
