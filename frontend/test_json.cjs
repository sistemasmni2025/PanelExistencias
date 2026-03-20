const fs = require('fs');
const mysql = require('mysql2/promise');

async function getSchemas() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    const [almcatCols] = await connection.query('SHOW COLUMNS FROM almcat');
    const [invnorelCols] = await connection.query('SHOW COLUMNS FROM invnorel');
    const [almgruCols] = await connection.query('SHOW COLUMNS FROM almgru');

    // Muestra 1 fila unida de ejemplo
    // We don't know the exact join structure yet, but let's query first 5 columns from each to a JSON file.
    
    fs.writeFileSync('schema.json', JSON.stringify({
      almcat: almcatCols.map(c => c.Field),
      invnorel: invnorelCols.map(c => c.Field),
      almgru: almgruCols.map(c => c.Field)
    }, null, 2), 'utf-8');

    await connection.end();
  } catch(e) { console.error(e); }
}

getSchemas();
