const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',user: 'root',password: 'MyALinMnI92SQL',database: 'existencias',port: 3306
  });

  const queryAndPrint = async (table) => {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table} LIMIT 50`);
      // Find rows that have 17.86 or 11 or match AA or AAG-016
      const relevant = rows.filter(r => JSON.stringify(r).includes('17.86') || JSON.stringify(r).includes('11.00') || JSON.stringify(r).includes('AA'));
      if(relevant.length > 0) {
        console.log(`\n=== matches in ${table} ===`);
        console.log(relevant);
      }
    } catch(e) {}
  };

  const tables = ['categdes', 'almgru', 'artprom', 'promodesc', 'promocion', 'campana'];
  for(let t of tables) await queryAndPrint(t);
  
  process.exit();
}
test();
