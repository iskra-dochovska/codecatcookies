create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  max_uses integer,
  uses integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table promo_codes enable row level security;

create policy "authenticated full access to promo_codes" on promo_codes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
