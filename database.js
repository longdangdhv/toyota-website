const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'toyota.db'));

// Tạo các bảng
db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    price TEXT,
    priceRange TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    category TEXT,
    description TEXT,
    specs TEXT,
    features TEXT,
    colors TEXT,
    versions TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    image TEXT,
    date TEXT,
    category TEXT,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    validUntil TEXT,
    highlight INTEGER DEFAULT 0,
    details TEXT,
    applicableCars TEXT
  );

  CREATE TABLE IF NOT EXISTS test_drives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    car TEXT,
    date TEXT,
    time TEXT,
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    car TEXT,
    version TEXT,
    color TEXT,
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Hàm helper để chèn dữ liệu
const insertCar = db.prepare(`
  INSERT OR IGNORE INTO cars (id, name, slug, tagline, price, priceRange, image, featured, category, description, specs, features, colors, versions)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertNews = db.prepare(`
  INSERT OR IGNORE INTO news (id, title, slug, summary, image, date, category, content)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertPromotion = db.prepare(`
  INSERT OR IGNORE INTO promotions (id, title, description, image, validUntil, highlight, details, applicableCars)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Export database và các hàm
module.exports = {
  db,
  
  // Cars
  getAllCars: () => db.prepare('SELECT * FROM cars').all().map(car => ({
    ...car,
    featured: !!car.featured,
    specs: JSON.parse(car.specs),
    features: JSON.parse(car.features),
    colors: JSON.parse(car.colors),
    versions: JSON.parse(car.versions)
  })),
  
  getCarById: (id) => {
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(id);
    if (!car) return null;
    return {
      ...car,
      featured: !!car.featured,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features),
      colors: JSON.parse(car.colors),
      versions: JSON.parse(car.versions)
    };
  },
  
  getCarBySlug: (slug) => {
    const car = db.prepare('SELECT * FROM cars WHERE slug = ?').get(slug);
    if (!car) return null;
    return {
      ...car,
      featured: !!car.featured,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features),
      colors: JSON.parse(car.colors),
      versions: JSON.parse(car.versions)
    };
  },
  
  getFeaturedCars: () => db.prepare('SELECT * FROM cars WHERE featured = 1').all().map(car => ({
    ...car,
    featured: !!car.featured,
    specs: JSON.parse(car.specs),
    features: JSON.parse(car.features),
    colors: JSON.parse(car.colors),
    versions: JSON.parse(car.versions)
  })),
  
  updateCar: (carData) => {
    const stmt = db.prepare(`
      UPDATE cars SET name = ?, slug = ?, tagline = ?, price = ?, priceRange = ?, 
      image = ?, featured = ?, category = ?, description = ?
      WHERE id = ?
    `);
    return stmt.run(
      carData.name,
      carData.slug,
      carData.tagline,
      carData.price,
      carData.priceRange,
      carData.image,
      carData.featured,
      carData.category,
      carData.description,
      carData.id
    );
  },
  
  // News
  getAllNews: () => db.prepare('SELECT * FROM news ORDER BY date DESC').all(),
  
  getNewsById: (id) => db.prepare('SELECT * FROM news WHERE id = ?').get(id),
  
  getLatestNews: (limit = 3) => db.prepare('SELECT * FROM news ORDER BY date DESC LIMIT ?').all(limit),
  
  // Promotions
  getAllPromotions: () => db.prepare('SELECT * FROM promotions').all().map(promo => ({
    ...promo,
    highlight: !!promo.highlight,
    details: JSON.parse(promo.details),
    applicableCars: JSON.parse(promo.applicableCars)
  })),
  
  getActivePromotions: (limit = 2) => db.prepare('SELECT * FROM promotions LIMIT ?').all(limit).map(promo => ({
    ...promo,
    highlight: !!promo.highlight,
    details: JSON.parse(promo.details),
    applicableCars: JSON.parse(promo.applicableCars)
  })),
  
  // Test Drives
  createTestDrive: (data) => {
    const stmt = db.prepare(`
      INSERT INTO test_drives (name, phone, email, car, date, time, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.phone, data.email, data.car, data.date, data.time, data.note);
  },
  
  getAllTestDrives: () => db.prepare('SELECT * FROM test_drives ORDER BY created_at DESC').all(),
  
  // Quotes
  createQuote: (data) => {
    const stmt = db.prepare(`
      INSERT INTO quotes (name, phone, email, car, version, color, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.phone, data.email, data.car, data.version, data.color, data.note);
  },
  
  getAllQuotes: () => db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all(),
  
  // Contacts
  createContact: (data) => {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, phone, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.phone, data.email, data.subject, data.message);
  },
  
  getAllContacts: () => db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all(),
  
  getContactById: (id) => db.prepare('SELECT * FROM contacts WHERE id = ?').get(id),
  
  deleteContact: (id) => {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    return stmt.run(id);
  },
  
  searchContacts: (keyword) => {
    const stmt = db.prepare(`
      SELECT * FROM contacts 
      WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? OR message LIKE ?
      ORDER BY created_at DESC
    `);
    const search = `%${keyword}%`;
    return stmt.all(search, search, search, search);
  },
  
  // Insert data helpers
  insertCar,
  insertNews,
  insertPromotion
};
