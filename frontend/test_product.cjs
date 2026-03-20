const mysql = require('mysql2/promise');
const fs = require('fs');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });
  const [rows] = await connection.query("SELECT * FROM almcat WHERE almcve = 'AAG-016'");
  fs.writeFileSync('product.json', JSON.stringify(rows[0], null, 2));
  process.exit();
}
test();
