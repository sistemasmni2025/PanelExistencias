const mysql = require('mysql2/promise');

async function checkProcs() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });

  const [rows] = await connection.query("SHOW PROCEDURE STATUS WHERE Db = 'existencias'");
  console.log("=== PROCEDURES ===");
  rows.forEach(r => console.log(r.Name));
  process.exit();
}
checkProcs();
