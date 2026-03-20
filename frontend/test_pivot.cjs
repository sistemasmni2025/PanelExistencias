const mysql = require('mysql2/promise');

async function testPivot() {
  try {
    const connection = await mysql.createConnection({
      host: 'multillantasnieto.net',
      user: 'root',
      password: 'MyALinMnI92SQL',
      database: 'existencias',
      port: 3306
    });

    const [branches] = await connection.query('SELECT SucursalId, SucursalAbreviacion as sigla FROM sucursal WHERE SucursalAbreviacion IS NOT NULL');
    
    // We will build a dynamic SELECT part
    const branchSelects = branches.map(b => 
      `MAX(CASE WHEN s.SucursalId = ${b.SucursalId} THEN s.almstock ELSE 0 END) AS \`${b.sigla}\``
    ).join(',\n        ');

    const query = `
      SELECT 
        a.almcve as Clave, 
        a.ALMNOM as Descripcion, 
        g.grudesc as Grupo, 
        a.almnpart as NParte, 
        a.almstat as Status, 
        a.almplist as PLista,
        a.almprec as PrecioFacturado,
        0 as Descuento,
        0 as Promocion,
        ${branchSelects}
      FROM almcat a
      LEFT JOIN almgru g ON a.grucve = g.grucve
      LEFT JOIN sucursalarticulo s ON a.almcve = s.almcve
      GROUP BY a.almcve
      LIMIT 2
    `;

    const [results] = await connection.query(query);
    console.log(results);

    await connection.end();
  } catch(e) { console.error(e); }
}

testPivot();
