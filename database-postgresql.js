const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/toyota',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        tagline TEXT,
        price VARCHAR(100),
        price_range VARCHAR(100),
        image TEXT,
        images JSONB,
        featured INTEGER DEFAULT 0,
        category VARCHAR(100),
        description TEXT,
        specs JSONB,
        features JSONB,
        colors JSONB,
        versions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        image TEXT,
        date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount VARCHAR(100),
        valid_until VARCHAR(50),
        image TEXT,
        highlight BOOLEAN DEFAULT false,
        details JSONB,
        applicable_cars JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS test_drives (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        car_model VARCHAR(255),
        preferred_date VARCHAR(50),
        preferred_time VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        car_model VARCHAR(255),
        payment_method VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS uploaded_images (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        image_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables created');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    client.release();
  }
}

// Call init on module load
initDatabase().catch(console.error);

module.exports = {
  // Cars
  getAllCars: async () => {
    const result = await pool.query('SELECT * FROM cars ORDER BY id');
    return result.rows;
  },

  getCarById: async (id) => {
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    return result.rows[0];
  },

  getCarBySlug: async (slug) => {
    const result = await pool.query('SELECT * FROM cars WHERE slug = $1', [slug]);
    return result.rows[0];
  },

  getFeaturedCars: async () => {
    const result = await pool.query('SELECT * FROM cars WHERE featured = 1 ORDER BY id');
    return result.rows;
  },

  addCar: async (carData) => {
    const result = await pool.query(
      `INSERT INTO cars (name, slug, tagline, price, price_range, image, images, featured, category, description, specs, features, colors, versions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        carData.name,
        carData.slug,
        carData.tagline || '',
        carData.price || '',
        carData.priceRange || '',
        carData.image || '',
        JSON.stringify(carData.images || []),
        carData.featured || 0,
        carData.category || '',
        carData.description || '',
        JSON.stringify(carData.specs || {}),
        JSON.stringify(carData.features || []),
        JSON.stringify(carData.colors || []),
        JSON.stringify(carData.versions || [])
      ]
    );
    return { lastInsertRowid: result.rows[0].id };
  },

  updateCar: async (carData) => {
    const result = await pool.query(
      `UPDATE cars SET 
        name = $1, 
        slug = $2, 
        tagline = $3, 
        price = $4, 
        price_range = $5, 
        image = $6, 
        images = $7, 
        featured = $8, 
        category = $9, 
        description = $10,
        specs = COALESCE($11, specs),
        features = COALESCE($12, features),
        colors = COALESCE($13, colors),
        versions = COALESCE($14, versions)
       WHERE id = $15`,
      [
        carData.name,
        carData.slug,
        carData.tagline,
        carData.price,
        carData.priceRange,
        carData.image,
        JSON.stringify(carData.images || []),
        carData.featured || 0,
        carData.category,
        carData.description,
        carData.specs ? JSON.stringify(carData.specs) : null,
        carData.features ? JSON.stringify(carData.features) : null,
        carData.colors ? JSON.stringify(carData.colors) : null,
        carData.versions ? JSON.stringify(carData.versions) : null,
        carData.id
      ]
    );
    return { changes: result.rowCount };
  },

  // News
  getAllNews: async () => {
    const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
    return result.rows;
  },

  getNewsById: async (id) => {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    return result.rows[0];
  },

  getLatestNews: async (limit = 3) => {
    const result = await pool.query('SELECT * FROM news ORDER BY id DESC LIMIT $1', [limit]);
    return result.rows;
  },

  // Promotions
  getAllPromotions: async () => {
    const result = await pool.query('SELECT * FROM promotions ORDER BY id DESC');
    return result.rows;
  },

  getActivePromotions: async (limit = 2) => {
    const result = await pool.query('SELECT * FROM promotions ORDER BY id DESC LIMIT $1', [limit]);
    return result.rows;
  },

  // Test Drives
  createTestDrive: async (data) => {
    const result = await pool.query(
      `INSERT INTO test_drives (name, phone, email, car_model, preferred_date, preferred_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [data.name, data.phone, data.email, data.car_model, data.preferred_date, data.preferred_time, data.notes]
    );
    return { lastInsertRowid: result.rows[0].id };
  },

  getAllTestDrives: async () => {
    const result = await pool.query('SELECT * FROM test_drives ORDER BY created_at DESC');
    return result.rows;
  },

  // Quotes
  createQuote: async (data) => {
    const result = await pool.query(
      `INSERT INTO quotes (name, phone, email, car_model, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [data.name, data.phone, data.email, data.car_model, data.payment_method, data.notes]
    );
    return { lastInsertRowid: result.rows[0].id };
  },

  getAllQuotes: async () => {
    const result = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
    return result.rows;
  },

  // Contacts
  createContact: async (data) => {
    const result = await pool.query(
      `INSERT INTO contacts (name, phone, email, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [data.name, data.phone, data.email, data.subject, data.message]
    );
    return { lastInsertRowid: result.rows[0].id };
  },

  getAllContacts: async () => {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return result.rows;
  },

  getContactById: async (id) => {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
    return result.rows[0];
  },

  deleteContact: async (id) => {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    return { changes: result.rowCount };
  },

  searchContacts: async (keyword) => {
    const search = `%${keyword}%`;
    const result = await pool.query(
      `SELECT * FROM contacts 
       WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR message ILIKE $1
       ORDER BY created_at DESC`,
      [search]
    );
    return result.rows;
  },

  // Uploaded Images
  getAllUploadedImages: async () => {
    const result = await pool.query('SELECT * FROM uploaded_images ORDER BY created_at DESC');
    return result.rows;
  },

  saveUploadedImage: async (name, imageData) => {
    const result = await pool.query(
      `INSERT INTO uploaded_images (name, image_data) VALUES ($1, $2) RETURNING id`,
      [name, imageData]
    );
    return { lastInsertRowid: result.rows[0].id };
  },

  deleteUploadedImage: async (id) => {
    const result = await pool.query('DELETE FROM uploaded_images WHERE id = $1', [id]);
    return { changes: result.rowCount };
  }
};
