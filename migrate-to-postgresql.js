const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/toyota',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Read JSON files
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf-8'));
const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'news.json'), 'utf-8'));
const promotionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'promotions.json'), 'utf-8'));
const testDrivesData = fs.existsSync(path.join(__dirname, 'data-test-drives.json')) 
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data-test-drives.json'), 'utf-8')) 
  : [];
const quotesData = fs.existsSync(path.join(__dirname, 'data-quotes.json')) 
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data-quotes.json'), 'utf-8')) 
  : [];
const contactsData = fs.existsSync(path.join(__dirname, 'data-contacts.json')) 
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data-contacts.json'), 'utf-8')) 
  : [];

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration to PostgreSQL...\n');

    // Create tables
    console.log('📋 Creating tables...');
    
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

    console.log('✅ Tables created\n');

    // Migrate Cars
    console.log('🚗 Migrating cars...');
    for (const car of carsData) {
      await client.query(
        `INSERT INTO cars (id, name, slug, tagline, price, price_range, image, images, featured, category, description, specs, features, colors, versions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           tagline = EXCLUDED.tagline,
           price = EXCLUDED.price,
           price_range = EXCLUDED.price_range,
           image = EXCLUDED.image,
           images = EXCLUDED.images,
           featured = EXCLUDED.featured,
           category = EXCLUDED.category,
           description = EXCLUDED.description,
           specs = EXCLUDED.specs,
           features = EXCLUDED.features,
           colors = EXCLUDED.colors,
           versions = EXCLUDED.versions`,
        [
          car.id,
          car.name,
          car.slug,
          car.tagline || '',
          car.price || '',
          car.priceRange || '',
          car.image || '',
          JSON.stringify(car.images || []),
          car.featured === true || car.featured === 1 ? 1 : 0,
          car.category || '',
          car.description || '',
          JSON.stringify(car.specs || {}),
          JSON.stringify(car.features || []),
          JSON.stringify(car.colors || []),
          JSON.stringify(car.versions || [])
        ]
      );
    }
    console.log(`✅ Migrated ${carsData.length} cars\n`);

    // Migrate News
    console.log('📰 Migrating news...');
    for (const news of newsData) {
      await client.query(
        `INSERT INTO news (id, title, excerpt, content, image, date)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content,
           image = EXCLUDED.image,
           date = EXCLUDED.date`,
        [news.id, news.title, news.excerpt, news.content, news.image, news.date]
      );
    }
    console.log(`✅ Migrated ${newsData.length} news articles\n`);

    // Migrate Promotions
    console.log('🎁 Migrating promotions...');
    for (const promo of promotionsData) {
      await client.query(
        `INSERT INTO promotions (id, title, description, discount, valid_until, image, highlight, details, applicable_cars)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           discount = EXCLUDED.discount,
           valid_until = EXCLUDED.valid_until,
           image = EXCLUDED.image,
           highlight = EXCLUDED.highlight,
           details = EXCLUDED.details,
           applicable_cars = EXCLUDED.applicable_cars`,
        [
          promo.id, 
          promo.title, 
          promo.description, 
          promo.discount || '', 
          promo.validUntil, 
          promo.image,
          promo.highlight || false,
          JSON.stringify(promo.details || []),
          JSON.stringify(promo.applicableCars || [])
        ]
      );
    }
    console.log(`✅ Migrated ${promotionsData.length} promotions\n`);

    // Migrate Test Drives
    if (testDrivesData.length > 0) {
      console.log('🚙 Migrating test drives...');
      for (const td of testDrivesData) {
        await client.query(
          `INSERT INTO test_drives (name, phone, email, car_model, preferred_date, preferred_time, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [td.name, td.phone, td.email, td.car_model, td.preferred_date, td.preferred_time, td.notes, td.created_at || new Date()]
        );
      }
      console.log(`✅ Migrated ${testDrivesData.length} test drives\n`);
    }

    // Migrate Quotes
    if (quotesData.length > 0) {
      console.log('💰 Migrating quotes...');
      for (const quote of quotesData) {
        await client.query(
          `INSERT INTO quotes (name, phone, email, car_model, payment_method, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [quote.name, quote.phone, quote.email, quote.car_model, quote.payment_method, quote.notes, quote.created_at || new Date()]
        );
      }
      console.log(`✅ Migrated ${quotesData.length} quotes\n`);
    }

    // Migrate Contacts
    if (contactsData.length > 0) {
      console.log('📧 Migrating contacts...');
      for (const contact of contactsData) {
        await client.query(
          `INSERT INTO contacts (name, phone, email, subject, message, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [contact.name, contact.phone, contact.email, contact.subject, contact.message, contact.created_at || new Date()]
        );
      }
      console.log(`✅ Migrated ${contactsData.length} contacts\n`);
    }

    // Update sequences
    await client.query(`SELECT setval('cars_id_seq', (SELECT MAX(id) FROM cars))`);
    await client.query(`SELECT setval('news_id_seq', (SELECT MAX(id) FROM news))`);
    await client.query(`SELECT setval('promotions_id_seq', (SELECT MAX(id) FROM promotions))`);

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Cars: ${carsData.length}`);
    console.log(`   - News: ${newsData.length}`);
    console.log(`   - Promotions: ${promotionsData.length}`);
    console.log(`   - Test Drives: ${testDrivesData.length}`);
    console.log(`   - Quotes: ${quotesData.length}`);
    console.log(`   - Contacts: ${contactsData.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
