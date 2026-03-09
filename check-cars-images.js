const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/toyota',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function checkCars() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking cars in database...\n');
    
    const result = await client.query('SELECT id, name, image, images FROM cars ORDER BY id');
    
    result.rows.forEach(car => {
      console.log(`📌 Car ID ${car.id}: ${car.name}`);
      console.log(`   Image: ${car.image ? (car.image.substring(0, 50) + '...') : 'NULL'}`);
      console.log(`   Images array:`, car.images);
      console.log(`   Images type:`, typeof car.images);
      console.log(`   Images is array:`, Array.isArray(car.images));
      console.log(`   Images length:`, car.images ? (Array.isArray(car.images) ? car.images.length : 'N/A') : 0);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkCars().catch(console.error);
