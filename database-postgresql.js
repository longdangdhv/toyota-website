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

    await client.query(`
      CREATE TABLE IF NOT EXISTS showroom_info (
        id SERIAL PRIMARY KEY,
        showroom_name VARCHAR(255),
        hotline VARCHAR(100),
        hotline2 VARCHAR(100),
        email VARCHAR(255),
        email2 VARCHAR(255),
        address TEXT,
        address2 TEXT,
        working_hours VARCHAR(255),
        facebook_url VARCHAR(255),
        zalo_url VARCHAR(255),
        youtube_url VARCHAR(255),
        map_embed TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default showroom info if not exists
    const existing = await client.query('SELECT id FROM showroom_info LIMIT 1');
    if (existing.rows.length === 0) {
      await client.query(`
        INSERT INTO showroom_info (showroom_name, hotline, email, address, working_hours)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        'Toyota Đại Lý',
        '1800 1234',
        'info@toyota.vn',
        'Số 1, Đường Toyota, Quận 1, TP.HCM',
        'Thứ 2 - Thứ 7: 7:30 - 18:00 | Chủ nhật: 8:00 - 17:00'
      ]);
    }

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
  },

  // Showroom Info
  getShowroomInfo: async () => {
    const result = await pool.query('SELECT * FROM showroom_info ORDER BY id LIMIT 1');
    return result.rows[0] || null;
  },

  updateShowroomInfo: async (data) => {
    const existing = await pool.query('SELECT id FROM showroom_info LIMIT 1');
    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE showroom_info SET
          showroom_name = $1,
          hotline = $2,
          hotline2 = $3,
          email = $4,
          email2 = $5,
          address = $6,
          address2 = $7,
          working_hours = $8,
          facebook_url = $9,
          zalo_url = $10,
          youtube_url = $11,
          map_embed = $12,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $13`,
        [
          data.showroom_name, data.hotline, data.hotline2,
          data.email, data.email2, data.address, data.address2,
          data.working_hours, data.facebook_url, data.zalo_url,
          data.youtube_url, data.map_embed, existing.rows[0].id
        ]
      );
      return { changes: result.rowCount };
    } else {
      const result = await pool.query(
        `INSERT INTO showroom_info (showroom_name, hotline, hotline2, email, email2, address, address2, working_hours, facebook_url, zalo_url, youtube_url, map_embed)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [
          data.showroom_name, data.hotline, data.hotline2,
          data.email, data.email2, data.address, data.address2,
          data.working_hours, data.facebook_url, data.zalo_url,
          data.youtube_url, data.map_embed
        ]
      );
      return { lastInsertRowid: result.rows[0].id };
    }
  }
};
