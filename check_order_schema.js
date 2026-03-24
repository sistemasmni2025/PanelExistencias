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
    console.log('--- VENTA COLUMNS ---');
    const [vCols] = await pool.query('DESCRIBE venta');
    console.log(vCols.map(c => c.Field).join(', '));

    console.log('\n--- VENTADETALLE COLUMNS ---');
    const [vdCols] = await pool.query('DESCRIBE ventadetalle');
    console.log(vdCols.map(c => c.Field).join(', '));

    // Also check if there is a surtimiento table
    const [tables] = await pool.query('SHOW TABLES');
    const surtTables = tables.map(t => Object.values(t)[0]).filter(t => t.toLowerCase().includes('surt'));
    console.log('\n--- SURTIMIENTO RELATED TABLES ---');
    console.log(surtTables.join(', '));

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

check();
