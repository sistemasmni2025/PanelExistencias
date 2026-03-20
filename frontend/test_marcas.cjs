const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });

  const [rows] = await connection.query("SELECT DISTINCT grumar FROM almgru");
  console.log("Distinct grumar:", rows.map(r => r.grumar));
  
  process.exit();
}
test();
