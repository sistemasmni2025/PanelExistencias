const mysql = require('mysql2/promise');
const fs = require('fs');

async function checkUser() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
  });

  const [rows] = await connection.query("SELECT * FROM usuario WHERE usuariologin = 'VIGA6094'");
  let out = "Users found: " + JSON.stringify(rows, null, 2) + "\n";

  fs.writeFileSync('viga_out.txt', out);
  console.log("Written to viga_out.txt");
  await connection.end();
}
checkUser();
