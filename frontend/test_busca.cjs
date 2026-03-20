const mysql = require('mysql2/promise');
require('dotenv').config();

async function testFetch() {
  try {
    const c = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 3306
    });

    const [rows] = await c.query(`
      SELECT a.almcve, a.ALMNOM, a.grucve, SUM(s.almstock) as total_stock
      FROM almcat a 
      LEFT JOIN sucursalarticulo s ON a.almcve = s.almcve 
      WHERE a.grucve IN ('07','20','45','46','57')
      GROUP BY a.almcve
      HAVING total_stock > 0
    `);
    
    console.log("Total products in ASOCIADAS with stock > 0:", rows.length);

    await c.end();
  } catch (err) {
    console.error(err);
  }
}

testFetch();
