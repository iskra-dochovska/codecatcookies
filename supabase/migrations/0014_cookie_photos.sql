alter table cookies add column image_cross_path text;

update cookies set image_path = '/cookies/caramel-hand.jpg', image_cross_path = '/cookies/caramel-cross.jpg' where slug = 'caramel';
update cookies set image_path = '/cookies/chocolate-chip-hand.jpg', image_cross_path = '/cookies/chocolate-chip-cross.jpg' where slug = 'chocolate-chip';
update cookies set image_path = '/cookies/cinnamon-swirl-hand.jpg', image_cross_path = '/cookies/cinnamon-swirl-cross.jpg' where slug = 'cinnamon-swirl';
update cookies set image_path = '/cookies/earl-grey-hand.jpg', image_cross_path = null where slug = 'earl-grey';
update cookies set image_path = '/cookies/lemon-hand.jpg', image_cross_path = '/cookies/lemon-cross.jpg' where slug = 'lemon';
update cookies set image_path = '/cookies/oatmeal-hand.jpg', image_cross_path = '/cookies/oatmeal-cross.jpg' where slug = 'oatmeal';
update cookies set image_path = '/cookies/dark-chocolate-orange-hand.jpg', image_cross_path = '/cookies/dark-chocolate-orange-cross.jpg' where slug = 'dark-chocolate-orange';
update cookies set image_path = '/cookies/double-chocolate-peanut-butter-hand.jpg', image_cross_path = '/cookies/double-chocolate-peanut-butter-cross.jpg' where slug = 'double-chocolate-peanut-butter';
update cookies set image_path = '/cookies/triple-chocolate-hand.jpg', image_cross_path = '/cookies/triple-chocolate-cross.jpg' where slug = 'triple-chocolate';
update cookies set image_path = '/cookies/white-chocolate-hand.jpg', image_cross_path = '/cookies/white-chocolate-cross.jpg' where slug = 'white-chocolate';
