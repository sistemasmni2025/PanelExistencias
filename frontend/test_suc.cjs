const mysql = require('mysql2/promise');

async function checkSucursalCols() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    const [cols] = await connection.query('SHOW COLUMNS FROM sucursal');
    console.log(cols.map(c => c.Field).join(', '));
    const [rows] = await connection.query('SELECT * FROM sucursal LIMIT 5');
    console.log(rows);
    
    await connection.end();
  } catch(e) { console.error(e); }
}
checkSucursalCols();
