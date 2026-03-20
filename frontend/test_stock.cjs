const mysql = require('mysql2/promise');

async function checkStockTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    console.log('--- SUCURSALARTICULO ---');
    try {
      const [cols] = await connection.query('SHOW COLUMNS FROM sucursalarticulo');
      console.log(cols.map(c => c.Field).join(', '));
      const [rows] = await connection.query('SELECT * FROM sucursalarticulo LIMIT 1');
      console.log(rows[0]);
    } catch(e) {}

    console.log('\n--- ALMRESTALMRES ---');
    try {
      const [cols] = await connection.query('SHOW COLUMNS FROM almrestalmres');
      console.log(cols.map(c => c.Field).join(', '));
      const [rows] = await connection.query('SELECT * FROM almrestalmres LIMIT 1');
      console.log(rows[0]);
    } catch(e) {}

    console.log('\n--- SUCURSAL ---');
    try {
      const [cols] = await connection.query('SHOW COLUMNS FROM sucursal');
      console.log(cols.map(c => c.Field).join(', '));
      const [rows] = await connection.query('SELECT * FROM sucursal LIMIT 1');
      console.log(rows[0]);
    } catch(e) {}

    await connection.end();
  } catch(e) { console.error(e); }
}

checkStockTables();
