const { insertCar, insertNews, insertPromotion } = require('./database');
const carsData = require('./cars.json');
const newsData = require('./news.json');
const promotionsData = require('./promotions.json');

console.log('Đang khởi tạo database...');

// Import cars
const insertCars = insertCar;
carsData.forEach(car => {
  insertCars.run(
    car.id,
    car.name,
    car.slug,
    car.tagline,
    car.price,
    car.priceRange,
    car.image,
    car.featured ? 1 : 0,
    car.category,
    car.description,
    JSON.stringify(car.specs),
    JSON.stringify(car.features),
    JSON.stringify(car.colors),
    JSON.stringify(car.versions)
  );
});
console.log(`✓ Đã import ${carsData.length} xe`);

// Import news
newsData.forEach(article => {
  insertNews.run(
    article.id,
    article.title,
    article.slug,
    article.summary,
    article.image,
    article.date,
    article.category,
    article.content
  );
});
console.log(`✓ Đã import ${newsData.length} tin tức`);

// Import promotions
promotionsData.forEach(promo => {
  insertPromotion.run(
    promo.id,
    promo.title,
    promo.description,
    promo.image,
    promo.validUntil,
    promo.highlight ? 1 : 0,
    JSON.stringify(promo.details),
    JSON.stringify(promo.applicableCars)
  );
});
console.log(`✓ Đã import ${promotionsData.length} khuyến mãi`);

console.log('✓ Khởi tạo database thành công!');
