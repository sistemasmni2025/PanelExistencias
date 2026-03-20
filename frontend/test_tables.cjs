const mysql = require('mysql2/promise');
const fs = require('fs');

async function checkTables() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
  });

  try {
    let out = '';
    const [cCols] = await connection.query("SHOW COLUMNS FROM Cotizacion");
    out += "=== Cotizacion ===\n";
    out += cCols.map(c => `${c.Field} (${c.Type})`).join('\n');

    const [cdCols] = await connection.query("SHOW COLUMNS FROM CotizacionDetalle");
    out += "\n\n=== CotizacionDetalle ===\n";
    out += cdCols.map(c => `${c.Field} (${c.Type})`).join('\n');

    const [tables] = await connection.query("SHOW TABLES LIKE '%Cotizacion%'");
    out += "\n\n=== Otras tablas ===\n";
    out += tables.map(t => Object.values(t)[0]).join(', ');

    fs.writeFileSync('tables.txt', out);
    console.log("Written to tables.txt");
  } catch (e) {
    console.error(e.message);
  }

  await connection.end();
}
checkTables();
