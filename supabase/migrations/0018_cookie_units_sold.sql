alter table cookies add column units_sold integer not null default 0;

update cookies c
set units_sold = coalesce(sub.total, 0)
from (
  select oi.cookie_slug, sum(oi.quantity) as total
  from order_items oi
  join orders o on o.id = oi.order_id
  where o.status = 'completed'
  group by oi.cookie_slug
) sub
where c.slug = sub.cookie_slug;

create or replace function increment_units_sold_on_complete()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'pending' and new.status = 'completed' then
    update cookies c
    set units_sold = units_sold + oi.quantity
    from order_items oi
    where oi.order_id = new.id and oi.cookie_slug = c.slug;
  end if;
  return new;
end;
$$;

create trigger orders_increment_units_sold
after update on orders
for each row execute function increment_units_sold_on_complete();

create or replace function decrement_units_sold_on_delete()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'completed' then
    update cookies c
    set units_sold = units_sold - oi.quantity
    from order_items oi
    where oi.order_id = old.id and oi.cookie_slug = c.slug;
  end if;
  return old;
end;
$$;

create trigger orders_decrement_units_sold
after delete on orders
for each row execute function decrement_units_sold_on_delete();
