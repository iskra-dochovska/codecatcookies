create table cookie_images (
  id uuid primary key default gen_random_uuid(),
  cookie_slug text not null references cookies(slug) on delete cascade,
  path text not null,
  position integer not null default 0,
  object_position text not null default 'center' check (object_position in ('top', 'center', 'bottom')),
  created_at timestamptz not null default now()
);

create index cookie_images_cookie_slug_idx on cookie_images(cookie_slug, position);

alter table cookie_images enable row level security;

create policy "anyone can read cookie_images" on cookie_images
  for select using (true);

create policy "authenticated full access to cookie_images" on cookie_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into cookie_images (cookie_slug, path, position, object_position)
select slug, image_path, 0, 'top' from cookies where image_path is not null;

insert into cookie_images (cookie_slug, path, position, object_position)
select slug, image_cross_path, 1, 'top' from cookies where image_cross_path is not null;

alter table cookies drop column image_path;
alter table cookies drop column image_cross_path;

insert into storage.buckets (id, name, public)
values ('cookie-images', 'cookie-images', true)
on conflict (id) do nothing;

create policy "public can read cookie-images bucket" on storage.objects
  for select using (bucket_id = 'cookie-images');

create policy "authenticated can upload cookie-images" on storage.objects
  for insert with check (bucket_id = 'cookie-images' and auth.role() = 'authenticated');

create policy "authenticated can update cookie-images" on storage.objects
  for update using (bucket_id = 'cookie-images' and auth.role() = 'authenticated');

create policy "authenticated can delete cookie-images" on storage.objects
  for delete using (bucket_id = 'cookie-images' and auth.role() = 'authenticated');
