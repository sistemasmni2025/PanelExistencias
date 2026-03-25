const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306
  });
  try {
    const [rows] = await pool.query('SHOW COLUMNS FROM venta');
    console.log('--- COLUMNS IN venta ---');
    rows.forEach(r => console.log(r.Field));
    console.log('-------------------------');
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
check();
