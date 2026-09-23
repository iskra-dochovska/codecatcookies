create policy "authenticated can insert orders" on orders
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated can insert order_items" on order_items
  for insert with check (auth.role() = 'authenticated');

grant execute on function create_order(jsonb, jsonb, text) to authenticated;
