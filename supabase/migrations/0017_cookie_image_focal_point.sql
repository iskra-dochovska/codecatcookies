alter table cookie_images add column focal_y integer not null default 50 check (focal_y between 0 and 100);

update cookie_images set focal_y = case object_position
  when 'top' then 0
  when 'bottom' then 100
  else 50
end;

alter table cookie_images drop column object_position;
