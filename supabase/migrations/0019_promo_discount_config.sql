alter table promo_codes
  add column discount_type text not null default 'fixed' check (discount_type in ('fixed', 'percent')),
  add column discount_scope text not null default 'per_cookie' check (discount_scope in ('per_cookie', 'total')),
  add column discount_value numeric not null default 10;

alter table orders
  add column discount_amount integer not null default 0;

update orders o
set discount_amount = 10 * coalesce((
  select sum(oi.quantity) from order_items oi where oi.order_id = o.id
), 0)
where o.discount;

create or replace function create_order(order_data jsonb, items jsonb, promo_code text default null)
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
  total_quantity integer;
  order_total integer;
begin
  order_total := (order_data->>'total')::integer;

  select coalesce(sum((item->>'quantity')::integer), 0)
  into total_quantity
  from jsonb_array_elements(items) as item;

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
      into computed_discount_amount
      from jsonb_array_elements(items) as item;
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

  return jsonb_build_object(
    'order_id', new_order_id,
    'discount_applied', applied_discount,
    'discount_amount', computed_discount_amount
  );
end;
$$;
