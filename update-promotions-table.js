const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/toyota',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function updateTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Updating promotions table...');
    
    // Add missing columns if they don't exist
    await client.query(`
      ALTER TABLE promotions 
      ADD COLUMN IF NOT EXISTS highlight BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS details JSONB,
      ADD COLUMN IF NOT EXISTS applicable_cars JSONB;
    `);
    
    console.log('✅ Promotions table updated successfully!');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateTable().catch(console.error);
