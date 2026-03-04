const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// Sử dụng database phù hợp với môi trường
const useMongoDB = process.env.MONGODB_URI;

let db;
if (useMongoDB) {
  console.log('🔵 Using MongoDB database');
  db = require('./database-mongodb');
} else {
  console.log('📁 Using File-based database');
  db = require('./database-file');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'toyota-admin-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Routes
app.get('/', (req, res) => {
  const featuredCars = db.getFeaturedCars();
  const latestNews = db.getLatestNews(3);
  const activePromotions = db.getActivePromotions(2);
  
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
  const cars = db.getAllCars();
  res.render('products', { cars });
});

app.get('/san-pham/:slug', (req, res) => {
  const car = db.getCarBySlug(req.params.slug);
  if (!car) return res.status(404).send('Không tìm thấy xe');
  res.render('product-detail', { car });
});

app.get('/tin-tuc', (req, res) => {
  const news = db.getAllNews();
  res.render('news', { news });
});

app.get('/tin-tuc/:id', (req, res) => {
  const article = db.getNewsById(parseInt(req.params.id));
  if (!article) return res.status(404).send('Không tìm thấy tin tức');
  res.render('news-detail', { article });
});

app.get('/khuyen-mai', (req, res) => {
  const promotions = db.getAllPromotions();
  res.render('promotions', { promotions });
});

app.get('/dang-ky-lai-thu', (req, res) => {
  const cars = db.getAllCars();
  res.render('test-drive', { cars });
});

app.get('/tra-gop', (req, res) => {
  const cars = db.getAllCars();
  res.render('installment', { cars });
});

app.get('/lien-he', (req, res) => {
  res.render('contact');
});

// API endpoints for form submissions
app.post('/api/test-drive', async (req, res) => {
  try {
    await db.createTestDrive(req.body);
    res.json({ success: true, message: 'Đăng ký lái thử thành công! Chúng tôi sẽ liên hệ với bạn sớm.' });
  } catch (err) {
    console.error('Error creating test drive:', err);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

app.post('/api/quote', async (req, res) => {
  try {
    await db.createQuote(req.body);
    res.json({ success: true, message: 'Yêu cầu báo giá đã được gửi! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.' });
  } catch (err) {
    console.error('Error creating quote:', err);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    await db.createContact(req.body);
    res.json({ success: true, message: 'Tin nhắn của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm.' });
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

// Admin login routes
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.admin) {
    return res.redirect('/admin');
  }
  res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.admin = true;
    req.session.username = username;
    res.redirect('/admin');
  } else {
    res.render('admin-login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin dashboard
app.get('/admin', requireAuth, (req, res) => {
  const stats = {
    totalCars: db.getAllCars().length,
    featuredCars: db.getFeaturedCars().length,
    totalNews: db.getAllNews().length,
    totalPromotions: db.getAllPromotions().length,
    testDrives: db.getAllTestDrives().length,
    quotes: db.getAllQuotes().length,
    contacts: db.getAllContacts().length
  };
  res.render('admin-dashboard', { username: req.session.username, stats });
});

// Admin cars management
app.get('/admin/cars', requireAuth, (req, res) => {
  const cars = db.getAllCars();
  res.render('admin-cars', { cars });
});

app.get('/admin/cars/edit/:id', requireAuth, (req, res) => {
  const car = db.getCarById(parseInt(req.params.id));
  if (!car) return res.status(404).send('Không tìm thấy xe');
  res.render('admin-car-edit', { car });
});

app.post('/admin/cars/update/:id', requireAuth, (req, res) => {
  try {
    const carData = {
      id: parseInt(req.params.id),
      name: req.body.name,
      slug: req.body.slug,
      tagline: req.body.tagline,
      price: req.body.price,
      priceRange: req.body.priceRange,
      image: req.body.image,
      featured: req.body.featured === 'on' ? 1 : 0,
      category: req.body.category,
      description: req.body.description
    };
    db.updateCar(carData);
    res.redirect('/admin/cars');
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).send('Có lỗi xảy ra');
  }
});

// Admin news management
app.get('/admin/news', requireAuth, (req, res) => {
  const news = db.getAllNews();
  res.render('admin-news', { news });
});

// Admin promotions management
app.get('/admin/promotions', requireAuth, (req, res) => {
  const promotions = db.getAllPromotions();
  res.render('admin-promotions', { promotions });
});

// Admin data views
app.get('/admin/test-drives', requireAuth, async (req, res) => {
  const testDrives = await db.getAllTestDrives();
  res.render('admin-test-drives', { testDrives });
});

app.get('/admin/quotes', requireAuth, async (req, res) => {
  const quotes = await db.getAllQuotes();
  res.render('admin-quotes', { quotes });
});

app.get('/admin/contacts', requireAuth, async (req, res) => {
  const contacts = await db.getAllContacts();
  res.render('admin-contacts', { contacts });
});

app.get('/admin/contacts/view/:id', requireAuth, async (req, res) => {
  const contact = await db.getContactById(req.params.id);
  if (!contact) return res.status(404).send('Không tìm thấy tin nhắn');
  res.render('admin-contact-detail', { contact });
});

app.post('/admin/contacts/delete/:id', requireAuth, async (req, res) => {
  try {
    await db.deleteContact(req.params.id);
    res.redirect('/admin/contacts');
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send('Có lỗi xảy ra');
  }
});

app.get('/admin/contacts/search', requireAuth, async (req, res) => {
  const keyword = req.query.q || '';
  const contacts = keyword ? await db.searchContacts(keyword) : await db.getAllContacts();
  res.render('admin-contacts', { contacts, keyword });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
