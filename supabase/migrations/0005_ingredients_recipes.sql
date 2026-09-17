create table ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null check (unit in ('gram', 'item')),
  price_per_unit numeric not null,
  created_at timestamptz not null default now()
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  cookie_slug text not null unique references cookies(slug) on delete cascade,
  servings integer not null,
  created_at timestamptz not null default now()
);

create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete restrict,
  quantity numeric not null
);

create index recipe_ingredients_recipe_id_idx on recipe_ingredients(recipe_id);

alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

create policy "authenticated full access to ingredients" on ingredients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access to recipes" on recipes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access to recipe_ingredients" on recipe_ingredients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated can update cookies" on cookies
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
