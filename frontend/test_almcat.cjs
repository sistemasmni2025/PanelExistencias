const mysql = require('mysql2/promise');
const fs = require('fs');

async function check() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
  });

  try {
    const [cols] = await connection.query("SHOW COLUMNS FROM almcat");
    const out = "=== almcat ===\n" + cols.map(c => `${c.Field} (${c.Type})`).join('\n');
    fs.writeFileSync('almcat_schema.txt', out);
    console.log("Written to almcat_schema.txt");
  } catch (e) {
    console.error(e.message);
  }

  await connection.end();
}
check();
