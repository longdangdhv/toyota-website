const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/toyota',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function createTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Creating uploaded_images table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS uploaded_images (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        image_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Table created successfully!');
    
    // Kiểm tra bảng đã tạo
    const result = await client.query(`
      SELECT COUNT(*) as count FROM uploaded_images;
    `);
    console.log(`📊 Current images in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTable().catch(console.error);
