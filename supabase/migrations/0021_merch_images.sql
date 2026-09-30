create table merch_images (
  id uuid primary key default gen_random_uuid(),
  merch_slug text not null references merch(slug) on delete cascade,
  path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index merch_images_merch_slug_idx on merch_images(merch_slug, position);

alter table merch_images enable row level security;

create policy "anyone can read merch_images" on merch_images
  for select using (true);

create policy "authenticated full access to merch_images" on merch_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into merch_images (merch_slug, path, position)
select slug, image_path, 0 from merch where image_path is not null;

alter table merch drop column image_path;
