const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });

  const [cols] = await connection.query("SHOW COLUMNS FROM almgru");
  console.log("almgru COLS: ", cols.map(c => c.Field));
  
  process.exit();
}
test();
