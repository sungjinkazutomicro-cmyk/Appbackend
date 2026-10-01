// Creates every table the backend needs (safe to run again: it only creates
// what is missing). The server runs this by itself on startup when the
// variable AUTO_SETUP_DB=true is set, or you can run it by hand: npm run setup-db
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  // Hosted databases already exist, so drop the CREATE DATABASE / USE lines.
  sql = sql
    .replace(/^\s*CREATE DATABASE[^;]*;\s*$/gim, '')
    .replace(/^\s*USE\s+[^;]*;\s*$/gim, '');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  });
  try {
    await conn.query(sql);
    console.log('Database tables are ready.');
  } finally {
    await conn.end();
  }
}

module.exports = { setupDatabase };

if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Database setup failed:', err.message);
      process.exit(1);
    });
}
