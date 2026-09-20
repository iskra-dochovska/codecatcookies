alter table cookies add column purchasable boolean not null default true;

update cookies set purchasable = false where slug = 'caramel';
