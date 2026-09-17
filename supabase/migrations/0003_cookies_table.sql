create table cookies (
  slug text primary key,
  name text not null,
  price integer not null,
  production_cost integer not null default 0,
  admin_description text,
  image_path text,
  tagline_en text not null,
  tagline_mk text not null,
  scales jsonb not null default '[]'::jsonb,
  nutrition jsonb not null default '[]'::jsonb,
  allergens jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table cookies enable row level security;

create policy "anyone can read cookies" on cookies
  for select using (true);

insert into cookies (slug, name, price, production_cost, image_path, tagline_en, tagline_mk, scales, nutrition, allergens) values
(
  'chocolate-chip', 'Chocolate chip', 60, 30, '/cookies/choco_chip.png',
  'Classics have never tasted so good', 'Класичен вкус никогаш не бил поубав',
  '[{"label":"Sweetness","value":3},{"label":"Chewiness","value":2},{"label":"Thickness","value":3}]',
  '[{"label":"Calories","value":"265 kcal"},{"label":"Total fat","value":"14g"},{"label":"Saturated fat","value":"8.5g","indent":true},{"label":"Carbohydrates","value":"33g"},{"label":"Sugars","value":"17g","indent":true},{"label":"Fiber","value":"1g","indent":true},{"label":"Protein","value":"3g"},{"label":"Sodium","value":"36mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'oatmeal', 'Oatmeal', 60, 30, null,
  'Cheeky little breakfast treat', 'Почасти се малку за доручек',
  '[{"label":"Sweetness","value":3},{"label":"Chewiness","value":3},{"label":"Thickness","value":3}]',
  '[{"label":"Calories","value":"262 kcal"},{"label":"Total fat","value":"11g"},{"label":"Saturated fat","value":"6.2g","indent":true},{"label":"Carbohydrates","value":"36g"},{"label":"Sugars","value":"15.7g","indent":true},{"label":"Fiber","value":"1.9g","indent":true},{"label":"Protein","value":"5g"},{"label":"Sodium","value":"146mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk","Honey"]}'
),
(
  'caramel', 'Caramel', 70, 30, null,
  'Sugar in its stickiest form', 'Шеќер во најлеплива варијанта',
  '[{"label":"Sweetness","value":4},{"label":"Chewiness","value":4},{"label":"Thickness","value":1}]',
  '[{"label":"Calories","value":"305 kcal"},{"label":"Total fat","value":"15g"},{"label":"Saturated fat","value":"9g","indent":true},{"label":"Carbohydrates","value":"38g"},{"label":"Sugars","value":"26g","indent":true},{"label":"Fiber","value":"0.4g","indent":true},{"label":"Protein","value":"2g"},{"label":"Sodium","value":"269mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'cinnamon-swirl', 'Cinnamon Swirl', 70, 30, null,
  'The best pick me up for rainy days', 'Најдобрата утеха на врнежливи денови',
  '[{"label":"Sweetness","value":4},{"label":"Chewiness","value":2},{"label":"Thickness","value":1}]',
  '[{"label":"Calories","value":"264 kcal"},{"label":"Total fat","value":"14.8g"},{"label":"Saturated fat","value":"9.1g","indent":true},{"label":"Carbohydrates","value":"30.7g"},{"label":"Sugars","value":"14.8g","indent":true},{"label":"Fiber","value":"1.1g","indent":true},{"label":"Protein","value":"3g"},{"label":"Sodium","value":"48mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'white-chocolate', 'White chocolate', 80, 30, '/cookies/white_chocolate.png',
  'The fairest in the land', 'Најубавата на целиот свет',
  '[{"label":"Sweetness","value":4},{"label":"Chewiness","value":4},{"label":"Thickness","value":2}]',
  '[{"label":"Calories","value":"264 kcal"},{"label":"Total fat","value":"15g"},{"label":"Saturated fat","value":"9g","indent":true},{"label":"Carbohydrates","value":"30g"},{"label":"Sugars","value":"15g","indent":true},{"label":"Fiber","value":"0.5g","indent":true},{"label":"Protein","value":"3g"},{"label":"Sodium","value":"88mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'double-chocolate-peanut-butter', 'Double chocolate peanut butter', 80, 30, '/cookies/double_choco_pb.png',
  'Sticky centered hugged by a lotta chocolate', 'Полнета средина гушната од мнооогу чоколадо',
  '[{"label":"Sweetness","value":5},{"label":"Chewiness","value":4},{"label":"Thickness","value":5}]',
  '[{"label":"Calories","value":"418 kcal"},{"label":"Total fat","value":"25.5g"},{"label":"Saturated fat","value":"11.8g","indent":true},{"label":"Carbohydrates","value":"43g"},{"label":"Sugars","value":"22.5g","indent":true},{"label":"Fiber","value":"3g","indent":true},{"label":"Protein","value":"8g"},{"label":"Sodium","value":"189mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk","Peanuts"]}'
),
(
  'earl-grey', 'Earl Grey', 80, 30, null,
  'Even your cookie is sophisticated', 'Дури и кукисот ти е софистициран',
  '[{"label":"Sweetness","value":4},{"label":"Chewiness","value":4},{"label":"Thickness","value":4}]',
  '[{"label":"Calories","value":"323 kcal"},{"label":"Total fat","value":"15.3g"},{"label":"Saturated fat","value":"9.2g","indent":true},{"label":"Carbohydrates","value":"41.5g"},{"label":"Sugars","value":"17.8g","indent":true},{"label":"Fiber","value":"0.9g","indent":true},{"label":"Protein","value":"4.3g"},{"label":"Sodium","value":"332mg"},{"label":"Caffeine","value":"Yes"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'lemon', 'Lemon', 90, 30, '/cookies/lemon.png',
  'Pucker up and give me a smooch', 'Спреми се за благо киселки бакнежи',
  '[{"label":"Sweetness","value":3},{"label":"Chewiness","value":4},{"label":"Thickness","value":3}]',
  '[{"label":"Calories","value":"287 kcal"},{"label":"Total fat","value":"13g"},{"label":"Saturated fat","value":"7.8g","indent":true},{"label":"Carbohydrates","value":"38g"},{"label":"Sugars","value":"13g","indent":true},{"label":"Fiber","value":"1g","indent":true},{"label":"Protein","value":"4g"},{"label":"Sodium","value":"76mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'dark-chocolate-orange', 'Dark Chocolate & Orange', 100, 30, null,
  'Match made in heaven', 'Едноставно врвна комбинација',
  '[{"label":"Sweetness","value":3},{"label":"Chewiness","value":4},{"label":"Thickness","value":3}]',
  '[{"label":"Calories","value":"323 kcal"},{"label":"Total fat","value":"16.8g"},{"label":"Saturated fat","value":"10.1g","indent":true},{"label":"Carbohydrates","value":"39.3g"},{"label":"Sugars","value":"20.8g","indent":true},{"label":"Fiber","value":"1.8g","indent":true},{"label":"Protein","value":"3.9g"},{"label":"Sodium","value":"260mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
),
(
  'triple-chocolate', 'Triple Chocolate', 110, 30, null,
  'There will never be enough chocolate', 'Никогаш нема доволно чоколадо',
  '[{"label":"Sweetness","value":4},{"label":"Chewiness","value":4},{"label":"Thickness","value":4}]',
  '[{"label":"Calories","value":"305 kcal"},{"label":"Total fat","value":"17.2g"},{"label":"Saturated fat","value":"10g","indent":true},{"label":"Carbohydrates","value":"35.1g"},{"label":"Sugars","value":"16.3g","indent":true},{"label":"Fiber","value":"2.5g","indent":true},{"label":"Protein","value":"4.5g"},{"label":"Sodium","value":"259mg"}]',
  '{"contains":["Wheat (gluten)","Egg","Milk"]}'
);
