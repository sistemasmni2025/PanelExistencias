const mysql = require('mysql2/promise');
const fs = require('fs');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });

  const [tables] = await connection.query("SHOW TABLES");
  const tableNames = tables.map(t => Object.values(t)[0]);
  
  for(let table of tableNames) {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table}`);
      const relevant = rows.filter(r => JSON.stringify(r).includes('2700.06') || JSON.stringify(r).includes('17.86'));
      if(relevant.length > 0) {
        console.log(`\n=== matches in ${table} ===`);
        console.log(relevant);
      }
    } catch(e) {}
  }
  
  process.exit();
}
test();
