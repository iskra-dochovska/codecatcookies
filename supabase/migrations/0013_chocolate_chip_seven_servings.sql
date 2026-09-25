update cookies
set
  production_cost = 24,
  nutrition = '[
    {"label": "Calories", "value": "343 kcal"},
    {"label": "Total fat", "value": "18.3g"},
    {"label": "Saturated fat", "value": "11.4g", "indent": true},
    {"label": "Carbohydrates", "value": "41.1g"},
    {"label": "Sugars", "value": "21.7g", "indent": true},
    {"label": "Fiber", "value": "1.1g", "indent": true},
    {"label": "Protein", "value": "4.6g"},
    {"label": "Sodium", "value": "50mg"}
  ]'::jsonb
where slug = 'chocolate-chip';
