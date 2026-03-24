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
    const [vCols] = await pool.query('DESCRIBE venta');
    console.log('--- VENTA ---');
    console.log(vCols.map(c => c.Field).join('|'));

    const [vdCols] = await pool.query('DESCRIBE ventadetalle');
    console.log('--- VENTADETALLE ---');
    console.log(vdCols.map(c => c.Field).join('|'));

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

check();
