create or replace function create_order(order_data jsonb, items jsonb)
returns uuid
language plpgsql
as $$
declare
  new_order_id uuid;
begin
  insert into orders (full_name, email, phone, pickup_date, pickup_time, notes, total)
  values (
    order_data->>'full_name',
    order_data->>'email',
    order_data->>'phone',
    (order_data->>'pickup_date')::date,
    order_data->>'pickup_time',
    order_data->>'notes',
    (order_data->>'total')::integer
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

  return new_order_id;
end;
$$;

revoke all on function create_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function create_order(jsonb, jsonb) to service_role;
