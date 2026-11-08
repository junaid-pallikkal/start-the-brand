const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL or DIRECT_URL from .env.local or environment
let connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/DATABASE_URL="?([^"\r\n]+)"?/);
    if (match) {
      connectionString = match[1];
    }
  }
}

if (!connectionString) {
  console.error('Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('Error: supabase/schema.sql not found at', schemaPath);
  process.exit(1);
}

const schemaSql = fs.readFileSync(schemaPath, 'utf8');

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully. Applying schema migrations...');

    await client.query(schemaSql);
    console.log('Schema migration completed successfully!');

    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('Verified public tables in Supabase:');
    tablesRes.rows.forEach((r) => console.log(' - ' + r.table_name));
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
