const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    console.log('--- ESTRUCTURA DE LA TABLA ALMCAT ---');
    const [columns] = await connection.query('SHOW COLUMNS FROM almcat');
    console.table(columns.slice(0, 15)); // Show first 15 for brevity, or we can just print the names
    console.log(columns.map(c => c.Field).join(', '));
    
    console.log('\n--- DATOS DE MUESTRA (1 FILA) ---');
    const [rows] = await connection.query('SELECT * FROM almcat LIMIT 1');
    console.log(rows[0]);

    await connection.end();
  } catch (error) {
    console.error('Error de conexión:', error.message);
  }
}

testConnection();
