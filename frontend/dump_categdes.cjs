const mysql = require('mysql2/promise');
const fs = require('fs');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });
  const [rows] = await connection.query("SELECT * FROM categdes");
  fs.writeFileSync('categdes.json', JSON.stringify(rows, null, 2));
  process.exit();
}
test();
