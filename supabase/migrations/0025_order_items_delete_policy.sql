create policy "authenticated can delete order_items" on order_items
  for delete using (auth.role() = 'authenticated');
