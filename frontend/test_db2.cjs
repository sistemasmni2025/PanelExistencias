const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    console.log('--- ESTRUCTURA DE INvNOREL ---');
    const [invRows] = await connection.query('SHOW COLUMNS FROM invnorel');
    console.log(invRows.map(c => c.Field).join(', '));

    console.log('--- ESTRUCTURA DE ALMGRU ---');
    const [gruRows] = await connection.query('SHOW COLUMNS FROM almgru');
    console.log(gruRows.map(c => c.Field).join(', '));

    console.log('--- ESTRUCTURA DE SUCURSALARTICULO ---');
    try {
      const [sucRows] = await connection.query('SHOW COLUMNS FROM sucursalarticulo');
      console.log(sucRows.map(c => c.Field).join(', '));
    } catch(e) {}

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTables();
