create extension if not exists pgcrypto;

create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  pickup_date date not null,
  pickup_time text not null,
  notes text,
  total integer not null,
  status text not null default 'pending' check (status in ('pending', 'completed'))
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  cookie_slug text not null,
  cookie_name text not null,
  quantity integer not null,
  unit_price integer not null,
  unit_cost numeric not null default 0
);

create index orders_created_at_idx on orders(created_at);
create index orders_status_idx on orders(status);
create index order_items_order_id_idx on order_items(order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "authenticated can read orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "authenticated can update orders" on orders
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated can read order_items" on order_items
  for select using (auth.role() = 'authenticated');
