-- 0020/0023 replaced create_order with a simplified body that accidentally
-- dropped the server-side discount computation and promo_code storage that
-- 0019 had added. Restoring that logic here, extended to also account for
-- merch line items in the discount calculation (matching the combined
-- cookie+merch discount preview shown to customers at checkout).

create or replace function create_order(order_data jsonb, items jsonb, promo_code text default null, merch_items jsonb default '[]'::jsonb)
returns jsonb
language plpgsql
as $$
declare
  new_order_id uuid;
  applied_discount boolean := false;
  computed_discount_amount integer := 0;
  promo_id uuid;
  resolved_code text;
  promo_discount_type text;
  promo_discount_scope text;
  promo_discount_value numeric;
  cookie_quantity integer;
  merch_quantity integer;
  total_quantity integer;
  cookie_discount integer;
  merch_discount integer;
  order_total integer;
begin
  order_total := (order_data->>'total')::integer;

  select coalesce(sum((item->>'quantity')::integer), 0) into cookie_quantity
  from jsonb_array_elements(items) as item;

  select coalesce(sum((item->>'quantity')::integer), 0) into merch_quantity
  from jsonb_array_elements(merch_items) as item;

  total_quantity := cookie_quantity + merch_quantity;

  if promo_code is not null and btrim(promo_code) <> '' then
    select id, code, discount_type, discount_scope, discount_value
    into promo_id, resolved_code, promo_discount_type, promo_discount_scope, promo_discount_value
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

    if promo_discount_type = 'percent' and promo_discount_scope = 'per_cookie' then
      select coalesce(sum(round((item->>'unit_price')::numeric * (item->>'quantity')::integer * promo_discount_value / 100)), 0)
      into cookie_discount
      from jsonb_array_elements(items) as item;

      select coalesce(sum(round((item->>'unit_price')::numeric * (item->>'quantity')::integer * promo_discount_value / 100)), 0)
      into merch_discount
      from jsonb_array_elements(merch_items) as item;

      computed_discount_amount := cookie_discount + merch_discount;
    elsif promo_discount_type = 'percent' then
      computed_discount_amount := round(order_total * promo_discount_value / 100);
    elsif promo_discount_scope = 'per_cookie' then
      computed_discount_amount := round(promo_discount_value * total_quantity);
    else
      computed_discount_amount := round(promo_discount_value);
    end if;

    computed_discount_amount := least(computed_discount_amount, order_total);
  end if;

  insert into orders (full_name, email, phone, pickup_date, pickup_time, notes, total, discount, discount_amount, promo_code)
  values (
    order_data->>'full_name',
    order_data->>'email',
    order_data->>'phone',
    (order_data->>'pickup_date')::date,
    order_data->>'pickup_time',
    order_data->>'notes',
    order_total,
    applied_discount,
    computed_discount_amount,
    resolved_code
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

  insert into order_merch_items (order_id, merch_slug, merch_name, quantity, unit_price, unit_cost)
  select
    new_order_id,
    item->>'merch_slug',
    item->>'merch_name',
    (item->>'quantity')::integer,
    (item->>'unit_price')::integer,
    (item->>'unit_cost')::numeric
  from jsonb_array_elements(merch_items) as item;

  return jsonb_build_object(
    'order_id', new_order_id,
    'discount_applied', applied_discount,
    'discount_amount', computed_discount_amount
  );
end;
$$;

revoke all on function create_order(jsonb, jsonb, text, jsonb) from public, anon, authenticated;
grant execute on function create_order(jsonb, jsonb, text, jsonb) to service_role, authenticated;
