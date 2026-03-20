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
    
    // Most likely table names for orders
    const tablesToCheck = ['pedido', 'pedidodetalle', 'venta', 'ventadetalle', 'cotizaciondetalle'];
    
    for (const tableName of tablesToCheck) {
      try {
        const [cols] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        out += `\n=== ${tableName} ===\n`;
        out += cols.map(c => `${c.Field} (${c.Type})`).join('\n');
      } catch (e) {
        out += `\n=== ${tableName} (No existe) ===\n`;
      }
    }

    const [allTables] = await connection.query("SHOW TABLES");
    out += "\n\n=== TODAS LAS TABLAS ===\n";
    out += allTables.map(t => Object.values(t)[0]).join(', ');

    fs.writeFileSync('tables_pedidos.txt', out);
    console.log("Written to tables_pedidos.txt");
  } catch (e) {
    console.error(e.message);
  }

  await connection.end();
}
checkTables();
