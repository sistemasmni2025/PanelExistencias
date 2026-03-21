const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
});

app.post('/api/login', async (req, res) => {
  const { user, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT usuariologin, UsuarioNombre, SucursalId FROM usuario WHERE TRIM(usuariologin) = ? AND (UsuarioPassword = ? OR UsuarioPass = ?)",
      [user.trim(), password, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/existencias/search', async (req, res) => {
  const { ancho, serie, rin, nombre, marca, conExistencias, isGamma } = req.query;
  try {
    const [branches] = await pool.query("SELECT SucursalId, SucursalAbreviacion as sigla FROM sucursal WHERE SucursalAbreviacion IS NOT NULL");

    const branchSelects = branches.map(b =>
      "MAX(CASE WHEN s.SucursalId = " + b.SucursalId + " THEN s.almstock ELSE 0 END) AS " + b.sigla
    ).join(', ');

    let query = "SELECT g.grudesc as Grupo, g.gruclas as gruclas, a.ALMNOM as Descripcion, a.almcve as Clave, a.almstat as Status, a.almnpart as NParte, a.almplist as PLista, IFNULL(c6.cgdesc30, 0) as Descuento, 0.00 as Promocion, ROUND(a.almplist * (1 - IFNULL(c6.cgdesc30, 0) / 100), 2) as PrecioFacturado, IFNULL(c1.cgdesc, 0) as DescPiso, ROUND(a.almplist * (1 - IFNULL(c1.cgdesc, 0) / 100), 2) as PVentaPiso, a.almiva as IVA_Flag, " + branchSelects + " FROM almcat a LEFT JOIN almgru g ON a.grucve = g.grucve LEFT JOIN sucursalarticulo s ON a.almcve = s.almcve LEFT JOIN categdes c6 ON c6.cgcve = a.grucve AND c6.categcve = 6 LEFT JOIN categdes c1 ON c1.cgcve = a.grucve AND c1.categcve = 1 WHERE 1=1";

    const params = [];
    if (ancho) { query += " AND a.almancho = ?"; params.push(ancho); }
    if (serie) { query += " AND a.almserie = ?"; params.push(serie); }
    if (rin) { query += " AND a.almrin = ?"; params.push(rin); }
    if (nombre) {
      // Busca tanto en el Nombre como en la Clave
      query += " AND (a.ALMNOM LIKE ? OR a.almcve LIKE ?)";
      params.push('%' + nombre + '%', '%' + nombre + '%');
    }
    if (isGamma === 'true') {
      query += " AND a.almstat = 'G'";
    }

    // Logica de mapeo extraida de Genexus.
    // Solo se aplica si no estamos buscando un nombre directo (Busqueda Global)
    if (marca && marca !== 'TODOS' && !nombre) {
      const m = marca.toUpperCase();
      if (m === 'INICIO') {
        query += " AND g.grumar IN ('MI','BF','UN','AS')";
      } else if (m === 'OTRAS MARCAS') {
        query += " AND (g.grumar NOT IN ('MI','BF','UN','AS','LS','RO','SL','CT','FW','TY') OR g.grumar = 'OM')";
      } else {
        let gmar = '';
        if (m === 'MICHELIN') gmar = 'MI';
        else if (m === 'BFGOODRICH') gmar = 'BF';
        else if (m === 'UNIROYAL') gmar = 'UN';
        else if (m === 'ASOCIADAS') gmar = 'AS';
        else if (m === 'ROVELO') gmar = 'RO';
        else if (m === 'CONTINENTAL') gmar = 'CT';
        else if (m === 'FRONWAY') gmar = 'FW';
        else if (m === 'TOYO') gmar = 'TY';

        if (gmar) {
          query += " AND g.grumar = ?";
          params.push(gmar);
        } else {
          query += " AND a.ALMNOM LIKE ?";
          params.push('%' + marca + '%');
        }
      }
    }

    // Incondicional de Genexus al cargar listado
    query += " AND g.gruclas IN ('A','C','M','D','G','E','B','O')";

    query += " GROUP BY a.almcve";

    if (conExistencias === 'true') {
      query += " HAVING SUM(IFNULL(s.almstock, 0)) > 0";
    }

    query += " ORDER BY g.grudesc, a.almcve LIMIT 2500";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT: PEDIDOS / VENTAS ---
app.get('/api/pedidos', async (req, res) => {
  const { usuario, desde, hasta, status } = req.query;
  try {
    let query = `
      SELECT 
        v.VentaId as id, 
        DATE_FORMAT(v.VentaFecha, '%d/%m/%Y') as fecha,
        v.VentaStatus, 
        v.UsuarioLogin as login, 
        u.UsuarioNombre as cliente,
        v.VentaOrden as ordenVenta,
        v.VentaSerie as serie,
        v.VentaFactura as factura,
        v.VentaObservaciones as obsCliente,
        v.VentaObservacion as obsNieto,
        SUM(vd.VentaDetalleCan * vd.VentaDetallePV) as subtotal_num,
        SUM(vd.VentaDetalleCan * vd.VentaDetallePV * IF(vd.VentaDetalleIva='S', 0.16, 0)) as iva_num
      FROM venta v
      LEFT JOIN usuario u ON v.UsuarioLogin = u.usuariologin
      LEFT JOIN ventadetalle vd ON v.VentaId = vd.VentaId
      WHERE 1=1
    `;
    const params = [];

    if (usuario) {
      query += ' AND v.UsuarioLogin = ?';
      params.push(usuario);
    }
    if (desde) {
      query += ' AND v.VentaFecha >= ?';
      params.push(desde);
    }
    if (hasta) {
      query += ' AND v.VentaFecha <= ?';
      params.push(hasta);
    }
    if (status && status !== 'Todos') {
      // Map frontend status to DB char, adjust logic based on genexus enum if needed
      query += ' AND v.VentaStatus = ?';
      params.push(status.charAt(0).toUpperCase()); // Simple map 'Solicitada' -> 'S', 'Facturada' -> 'F'
    }

    query += ' GROUP BY v.VentaId ORDER BY v.VentaId DESC LIMIT 100';

    const [rows] = await pool.query(query, params);

    // Map numerical values to formatted strings for the frontend
    const formattedRows = rows.map(r => {
      const subtotal = r.subtotal_num || 0;
      const iva = r.iva_num || 0;
      const total = subtotal + iva;

      let statusDesc = 'Desconocido';
      switch (r.VentaStatus) {
        case 'S': statusDesc = 'Solicitada'; break;
        case 'F': statusDesc = 'Facturada'; break;
        case 'E': statusDesc = 'Entregada'; break;
        case 'T': statusDesc = 'En Transito'; break;
        case 'R': statusDesc = 'Recepción'; break;
        default: statusDesc = r.VentaStatus;
      }

      return {
        id: r.id.toString(),
        fecha: r.fecha,
        status: statusDesc,
        statusDoc: statusDesc,
        login: r.login,
        cliente: r.cliente,
        ordenVenta: r.ordenVenta ? 'OV-' + r.ordenVenta : '',
        subtotal: '$' + subtotal.toFixed(2),
        iva: '$' + iva.toFixed(2),
        total: '$' + total.toFixed(2),
        serie: r.serie,
        factura: r.factura ? 'F-' + r.factura : '',
        obsCliente: r.obsCliente,
        obsNieto: r.obsNieto
      };
    });

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT: COTIZACIONES ---

// OBTENER MIS COTIZACIONES
app.get('/api/cotizaciones', async (req, res) => {
  const { usuario } = req.query;
  try {
    let query = 'SELECT * FROM Cotizacion';
    const params = [];
    if (usuario) {
      query += ' WHERE UsuarioLogin = ?';
      params.push(usuario);
    }
    query += ' ORDER BY CotizacionId DESC LIMIT 50';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OBTENER DETALLE DE UNA COTIZACION
app.get('/api/cotizaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [header] = await pool.query('SELECT * FROM Cotizacion WHERE CotizacionId = ?', [id]);
    const [details] = await pool.query('SELECT * FROM CotizacionDetalle WHERE CotizacionId = ?', [id]);

    if (header.length > 0) {
      res.json({ ...header[0], items: details });
    } else {
      res.status(404).json({ error: 'Cotización no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREAR COTIZACION (Header)
app.post('/api/cotizaciones', async (req, res) => {
  const { UsuarioLogin, nclicve, nclinom, ncategcve, nclidcred, nclimail } = req.body;
  try {
    const d = new Date();
    const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const [result] = await pool.query(
      'INSERT INTO Cotizacion (CotizacionFecha, UsuarioLogin, nclicve, nclinom, ncategcve, nclidcred, nclimail) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fecha, UsuarioLogin, nclicve || 0, nclinom || '', ncategcve || 1, nclidcred || 0, nclimail || '']
    );
    res.json({ success: true, CotizacionId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR COTIZACION (como en el procedure ActualizarCotizacion)
app.put('/api/cotizaciones/:id', async (req, res) => {
  const { id } = req.params;
  const { nclicve, nclinom, nclimail } = req.body;
  try {
    if (!nclicve || nclicve == 0) {
      await pool.query(
        'UPDATE Cotizacion SET nclicve = 0, nclinom = ?, ncategcve = 1, nclidcred = 0, nclimail = ? WHERE CotizacionId = ?',
        [nclinom, nclimail, id]
      );
    } else {
      await pool.query(
        'UPDATE Cotizacion SET nclicve = ?, nclinom = ?, nclimail = ? WHERE CotizacionId = ?',
        [nclicve, nclinom, nclimail, id]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AGREGAR ARTICULO A COTIZACION
app.post('/api/cotizaciones/:id/items', async (req, res) => {
  const { id } = req.params;
  const { clave, concepto, cantidad, precio, justificacion, tipo, iva } = req.body;
  try {
    // Verificar si ya existe el articulo para sumarle la cantidad
    const [exists] = await pool.query('SELECT CotizacionDetalleCantidad FROM CotizacionDetalle WHERE CotizacionId = ? AND CotizacionDetalleClave = ?', [id, clave]);
    if (exists.length > 0) {
      const nuevaCantidad = exists[0].CotizacionDetalleCantidad + (cantidad || 1);
      await pool.query('UPDATE CotizacionDetalle SET CotizacionDetalleCantidad = ? WHERE CotizacionId = ? AND CotizacionDetalleClave = ?', [nuevaCantidad, id, clave]);
    } else {
      await pool.query(
        'INSERT INTO CotizacionDetalle (CotizacionId, CotizacionDetalleClave, CotizacionDetalleConcepto, CotizacionDetalleCantidad, CotizacionDetallePrecio, CotizacionDetalleJustificacion, CotizacionDetalleTipo, CotizacionDetalleIva) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, clave, concepto, cantidad || 1, precio || 0, justificacion || '', tipo || 'A', iva || 'S']
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR PRECIO ARTICULO (ActualizarPrecio)
app.put('/api/cotizaciones/:id/items/:clave', async (req, res) => {
  const { id, clave } = req.params;
  const { precio, justificacion } = req.body;
  try {
    await pool.query(
      'UPDATE CotizacionDetalle SET CotizacionDetallePrecio = ?, CotizacionDetalleJustificacion = ? WHERE CotizacionId = ? AND CotizacionDetalleClave = ?',
      [precio, justificacion, id, clave]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR ARTICULO (EliminarArticulo)
app.delete('/api/cotizaciones/:id/items/:clave', async (req, res) => {
  const { id, clave } = req.params;
  try {
    await pool.query('DELETE FROM CotizacionDetalle WHERE CotizacionId = ? AND CotizacionDetalleClave = ?', [id, clave]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, '0.0.0.0', () => console.log('API Multillantas Lista corriendo en puerto 4000'));
