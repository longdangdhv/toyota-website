const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname);

// Import data
const cars = require('./cars.json');
const news = require('./news.json');
const promotions = require('./promotions.json');

// Routes
app.get('/', (req, res) => {
  const featuredCars = cars.filter(car => car.featured);
  const latestNews = news.slice(0, 3);
  const activePromotions = promotions.slice(0, 2);
  
  // Get banner images
  let banners = [];
  try {
    const files = fs.readdirSync(path.join(__dirname, 'images'));
    banners = files
      .filter(file => file.startsWith('banner-') && (file.endsWith('.jpg') || file.endsWith('.png')))
      .map(file => `/images/${file}`);
  } catch (err) {
    console.log('No images folder found');
  }
  
  res.render('index', { featuredCars, latestNews, activePromotions, banners });
});

app.get('/san-pham', (req, res) => {
  res.render('products', { cars });
});

app.get('/san-pham/:slug', (req, res) => {
  const car = cars.find(c => c.slug === req.params.slug);
  if (!car) return res.status(404).send('Không tìm thấy xe');
  res.render('product-detail', { car });
});

app.get('/tin-tuc', (req, res) => {
  res.render('news', { news });
});

app.get('/tin-tuc/:id', (req, res) => {
  const article = news.find(n => n.id === parseInt(req.params.id));
  if (!article) return res.status(404).send('Không tìm thấy tin tức');
  res.render('news-detail', { article });
});

app.get('/khuyen-mai', (req, res) => {
  res.render('promotions', { promotions });
});

app.get('/dang-ky-lai-thu', (req, res) => {
  res.render('test-drive', { cars });
});

app.get('/tra-gop', (req, res) => {
  res.render('installment', { cars });
});

app.get('/lien-he', (req, res) => {
  res.render('contact');
});

// API endpoints for form submissions
app.post('/api/test-drive', (req, res) => {
  console.log('Test drive registration:', req.body);
  res.json({ success: true, message: 'Đăng ký lái thử thành công! Chúng tôi sẽ liên hệ với bạn sớm.' });
});

app.post('/api/quote', (req, res) => {
  console.log('Quote request:', req.body);
  res.json({ success: true, message: 'Yêu cầu báo giá đã được gửi! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.' });
});

app.post('/api/contact', (req, res) => {
  console.log('Contact form:', req.body);
  res.json({ success: true, message: 'Tin nhắn của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm.' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
