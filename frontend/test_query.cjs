const mysql = require('mysql2/promise');

async function testQuery() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    const query = `
      SELECT 
        a.almcve, a.ALMNOM, a.grucve, a.almnpart, a.almstat, a.almprec, a.almplist,
        g.grudesc, g.grutip,
        (SELECT almstock FROM sucursalarticulo WHERE almcve = a.almcve AND SucursalId = 1) AS QRO,
        (SELECT SucursalSiglas FROM sucursal WHERE SucursalId = 1) AS SiglaQRO,
        (SELECT SucursalNombre FROM sucursal) AS all_sucursales
      FROM almcat a
      LEFT JOIN almgru g ON a.grucve = g.grucve
      LIMIT 1
    `;

    // Let's get all branches first to dynamically build the query easily
    const [branches] = await connection.query('SELECT SucursalId, SucursalSiglas FROM sucursal ORDER BY SucursalId');
    console.log("SUCURSALES DISPONIBLES:");
    console.log(branches.map(b => `${b.SucursalId}:${b.SucursalSiglas}`).join(', '));

    console.log("\nPRODUCTO DE EJEMPLO CON JOINS:");
    const [prod] = await connection.query(`
      SELECT 
        a.almcve, a.ALMNOM, a.grucve, a.almnpart, a.almstat, a.almprec, a.almplist
      FROM almcat a 
      LIMIT 1
    `);
    console.log(prod[0]);

    await connection.end();
  } catch(e) { console.error(e); }
}

testQuery();
