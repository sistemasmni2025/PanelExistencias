const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

// Configuración de Google Gemini (Versión 2.0 con Tools)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Definición de Funciones para el Bot (Herramientas)
const tools = [
  {
    functionDeclarations: [
      {
        name: "buscarProductos",
        description: "Busca productos en el catálogo por nombre, dimensiones o clave. Retorna descripción, clave, estatus y precio de lista.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: { type: "STRING", description: "Texto de búsqueda (ej: 'michelin 205/55R16')" }
          },
          required: ["query"]
        }
      },
      {
        name: "consultarExistencias",
        description: "Consulta el stock disponible por sucursal para un producto específico usando su clave.",
        parameters: {
          type: "OBJECT",
          properties: {
            clave: { type: "STRING", description: "La clave única del producto (ej: '100456')" }
          },
          required: ["clave"]
        }
      }
    ]
  }
];

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  tools: tools
});




/**
 * =========================================================================
 * LOGIN CON COMPATIBILIDAD HEREDADA (GENEXUS)
 * =========================================================================
 * Valida usuarios migrados del sistema anterior utilizando Twofish/Plano.
 */
app.post('/api/login', async (req, res) => {
  const { user, password } = req.body;
  
  try {
    const cleanUser = (user || '').trim().toUpperCase();
    const cleanPass = (password || '').trim();
    
    // Buscamos al usuario por login (Case-Insensitive)
    const [rows] = await pool.query(
      "SELECT u.usuariologin, u.UsuarioNombre, u.UsuarioPassword, u.SucursalId, s.SucursalAbreviacion as SucursalNombre, u.PerfilId FROM usuario u LEFT JOIN sucursal s ON u.SucursalId = s.SucursalId WHERE UPPER(TRIM(u.usuariologin)) = ?",
      [cleanUser]
    );

    if (rows.length > 0) {
      const dbUser = rows[0];
      const dbPassPlain = (dbUser.UsuarioPassword || '').trim(); 
      
      // Lógica de compatibilidad definitiva:
      const isMatch = 
        cleanPass === dbPassPlain || 
        cleanPass.toUpperCase() === dbPassPlain.toUpperCase() ||
        (dbPassPlain.length >= 6 && cleanPass.startsWith(dbPassPlain)) ||
        (dbPassPlain.length >= 6 && cleanPass.toUpperCase().startsWith(dbPassPlain.toUpperCase()));

      if (isMatch) {
         // Limpiamos datos sensibles antes de enviar al front
         delete dbUser.UsuarioPassword;
         delete dbUser.UsuarioPass;

         res.json({ 
           success: true, 
           user: dbUser 
         });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Contraseña incorrecta.' 
        });
      }
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'El usuario no existe.' 
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * =========================================================================
 * BÚSQUEDA DE EXISTENCIAS (DINÁMICA DE SUCURSALES Y CAMPAÑAS)
 * =========================================================================
 * Maneja el inventario en tiempo real con filtrado aditivo múltiple.
 */
app.get('/api/existencias/search', async (req, res) => {
  const { ancho, serie, rin, nombre, marca, conExistencias, isGamma, clase } = req.query; 
  
  try {
    const [branches] = await pool.query("SELECT SucursalId, SucursalAbreviacion as sigla FROM sucursal WHERE SucursalId IN (1,2,3,4,5,6,7,8,9,11)");

    const branchSelects = branches.map(b =>
      `MAX(CASE WHEN s.SucursalId = ${b.SucursalId} THEN s.almstock ELSE 0 END) AS ${b.sigla}`
    ).join(', ');

    let query = `
      SELECT 
        g.grudesc as Grupo, 
        g.gruclas as gruclas, 
        a.ALMNOM as Descripcion, 
        a.almcve as Clave, 
        a.almstat as Status, 
        a.almnpart as NParte, 
        a.almplist as PLista, 
        IFNULL(c6.cgdesc30, 0) as Descuento, 
        0.00 as Promocion, 
        ROUND(a.almplist * (1 - IFNULL(c6.cgdesc30, 0) / 100), 2) as PrecioFacturado, 
        IFNULL(c1.cgdesc, 0) as DescPiso, 
        ROUND(a.almplist * (1 - IFNULL(c1.cgdesc, 0) / 100), 2) as PVentaPiso, 
        a.almiva as IVA_Flag,
        MAX(CASE 
          WHEN (g.grumar = 'MI' OR g.grudesc LIKE '%MICHELIN%' OR a.ALMNOM LIKE '%MICHELIN%') AND cp.CampanaDescripcion LIKE '%Michelin%' THEN cp.CampanaDescripcion
          WHEN (g.grumar = 'BF' OR g.grudesc LIKE '%BFGOODRICH%' OR a.ALMNOM LIKE '%BFGOODRICH%' OR a.ALMNOM LIKE '%KO2%' OR a.ALMNOM LIKE '%KO3%') AND cp.CampanaDescripcion LIKE '%BFGoodrich%' THEN cp.CampanaDescripcion
          WHEN (g.grumar = 'UN' OR g.grudesc LIKE '%UNIROYAL%' OR a.ALMNOM LIKE '%UNIROYAL%') AND cp.CampanaDescripcion LIKE '%Uniroyal%' THEN cp.CampanaDescripcion
          WHEN (g.grudesc LIKE '%BRIDGESTONE%' OR a.ALMNOM LIKE '%BRIDGESTONE%') AND cp.CampanaDescripcion LIKE '%Bridgestone%' THEN cp.CampanaDescripcion
          ELSE NULL 
        END) as CampanaNombre,
        MAX(CASE 
          WHEN (g.grumar = 'MI' OR g.grudesc LIKE '%MICHELIN%' OR a.ALMNOM LIKE '%MICHELIN%') AND cp.CampanaDescripcion LIKE '%Michelin%' THEN cp.CampanaRutaPDF
          WHEN (g.grumar = 'BF' OR g.grudesc LIKE '%BFGOODRICH%' OR a.ALMNOM LIKE '%BFGOODRICH%' OR a.ALMNOM LIKE '%KO2%' OR a.ALMNOM LIKE '%KO3%') AND cp.CampanaDescripcion LIKE '%BFGoodrich%' THEN cp.CampanaRutaPDF
          WHEN (g.grumar = 'UN' OR g.grudesc LIKE '%UNIROYAL%' OR a.ALMNOM LIKE '%UNIROYAL%') AND cp.CampanaDescripcion LIKE '%Uniroyal%' THEN cp.CampanaRutaPDF
          WHEN (g.grudesc LIKE '%BRIDGESTONE%' OR a.ALMNOM LIKE '%BRIDGESTONE%') AND cp.CampanaDescripcion LIKE '%Bridgestone%' THEN cp.CampanaRutaPDF
          ELSE NULL 
        END) as CampanaPDF,
        ${branchSelects}
      FROM almcat a 
      LEFT JOIN almgru g ON a.grucve = g.grucve 
      LEFT JOIN sucursalarticulo s ON a.almcve = s.almcve 
      LEFT JOIN categdes c6 ON c6.cgcve = a.grucve AND c6.categcve = 6 
      LEFT JOIN categdes c1 ON c1.cgcve = a.grucve AND c1.categcve = 1 
      LEFT JOIN campana cp ON (
        a.almrin BETWEEN cp.CampanaRinInicio AND cp.CampanaRinFin 
        AND (cp.CampanaCateg = '' OR g.gruclas = cp.CampanaCateg)
        AND CURDATE() BETWEEN cp.CampanaFechaInicio AND cp.CampanaFechaFin
        AND (
            (cp.CampanaDescripcion LIKE '%Michelin%' AND (g.grumar = 'MI' OR g.grudesc LIKE '%MICHELIN%')) OR
            (cp.CampanaDescripcion LIKE '%BFGoodrich%' AND (g.grumar = 'BF' OR g.grudesc LIKE '%BFGOODRICH%')) OR
            (cp.CampanaDescripcion LIKE '%Uniroyal%' AND (g.grumar = 'UN' OR g.grudesc LIKE '%UNIROYAL%')) OR
            (cp.CampanaDescripcion LIKE '%Bridgestone%' AND g.grudesc LIKE '%BRIDGESTONE%')
        )
      )
      WHERE 1=1
    `;

    const params = [];
    if (ancho) { 
        query += " AND a.almancho = ?"; 
        params.push(ancho); 
    }
    if (serie) { 
        query += " AND a.almserie = ?"; 
        params.push(serie); 
    }
    if (rin) { 
        query += " AND a.almrin = ?"; 
        params.push(rin); 
    }
    
    if (nombre) {
      query += " AND (a.ALMNOM LIKE ? OR a.almcve LIKE ?)";
      params.push('%' + nombre + '%', '%' + nombre + '%');
    }
    
    if (isGamma === 'true') {
      query += " AND a.almstat = 'G'";
    }

    // --- MEJORA: FILTRADO POR CLASE (ADITIVO CON MAPEO) ---
    if (clase && clase !== 'TODOS') {
      let claseCode = clase;
      
      // Mapeo de nombres legibles a códigos de base de datos (gruclas)
      if (clase === 'Auto / Camioneta') {
        claseCode = 'A';
      } else if (clase === 'Camión') {
        claseCode = 'C';
      } else if (clase === 'MueveTierra') {
        claseCode = 'O';
      } else if (clase === 'Industrial') {
        claseCode = 'I';
      } else if (clase === 'Agrícola') {
        claseCode = 'G';
      } else if (clase === 'Motocicleta') {
        claseCode = 'M';
      } else if (clase === 'Camaras / Corbatas') {
        claseCode = '1';
      }


      query += " AND g.gruclas = ?";
      params.push(claseCode);
    }


    // --- FILTRADO POR MARCA (SOPORTA SELECCION MULTIPLE) ---
    if (marca && marca !== 'TODOS' && !nombre) {
      const marcasArray = marca.split(',');
      let marcaConditions = [];

      marcasArray.forEach(mItem => {
        const m = mItem.trim().toUpperCase();
        if (m === 'INICIO') {
          marcaConditions.push("g.grumar IN ('MI','BF','UN','AS')");
        } else if (m === 'OTRAS MARCAS') {
          marcaConditions.push("(g.grumar NOT IN ('MI','BF','UN','AS','LS','RO','SL','CT','FW','TY','LV','FS','BS','ID','TS') OR g.grumar = 'OM')");
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
          else if (m === 'LANVIGATOR') gmar = 'LV';
          else if (m === 'FIRESTONE') gmar = 'FS';
          else if (m === 'BRIDGESTONE') gmar = 'BS';
          else if (m === 'INDONESIA') gmar = 'ID';
          else if (m === 'TAURUS') gmar = 'TS';

          if (gmar) {
            marcaConditions.push("g.grumar = ?");
            params.push(gmar);
          } else {
            marcaConditions.push("a.ALMNOM LIKE ?");
            params.push('%' + mItem.trim() + '%');
          }
        }
      });

      if (marcaConditions.length > 0) {
        query += " AND (" + marcaConditions.join(" OR ") + ")";
      }
    }
    
    query += " GROUP BY a.almcve";

    if (conExistencias === 'true') {
      query += " HAVING SUM(IFNULL(s.almstock, 0)) > 0";
    }

    // --- MEJORA: ORDENAMIENTO PRIORITARIO (GAMMA Y LUEGO MAYOR STOCK) ---
    query += " ORDER BY (a.almstat = 'G') DESC, SUM(IFNULL(s.almstock, 0)) DESC, g.grudesc, a.almcve LIMIT 2500";

    const [rows] = await pool.query(query, params);
    
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * =========================================================================
 * LISTADO DE PEDIDOS / VENTAS
 * =========================================================================
 * Retorna el histórico o cola de pedidos filtrado por usuario/fecha.
 */
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

    if (usuario && usuario !== 'ADMIN') {
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
      let statusCode = status;
      if (status === 'Solicitada') statusCode = 'S';
      else if (status === 'Facturada') statusCode = 'F';
      else if (status === 'En Transito') statusCode = 'T';
      else if (status === 'Entregada') statusCode = 'E';
      else if (status === 'Recepcion Almacen') statusCode = 'R';

      query += ' AND v.VentaStatus = ?';
      params.push(statusCode);
    }

    query += ' GROUP BY v.VentaId ORDER BY v.VentaId DESC LIMIT 100';


    const [rows] = await pool.query(query, params);

    const formattedRows = rows.map(r => {
      const subtotal = parseFloat(r.subtotal_num) || 0;
      const iva = parseFloat(r.iva_num) || 0;
      const total = subtotal + iva;

      let statusBadge = 'SOLICITADA';
      let statusDoc = 'En Captura';

      switch (r.VentaStatus) {
        case 'S': statusBadge = 'SOLICITADA'; statusDoc = 'En Captura'; break;
        case 'F': statusBadge = 'FACTURADA'; statusDoc = 'Facturado'; break;
        case 'E': statusBadge = 'ENTREGADA'; statusDoc = 'Entregado'; break;
        case 'T': statusBadge = 'EN TRANSITO'; statusDoc = 'En Transito'; break;
        case 'R': statusBadge = 'RECEPCION'; statusDoc = 'Recepción Almacén'; break;
        default: statusBadge = r.VentaStatus || 'N/A'; statusDoc = r.VentaStatus || 'Procesando';
      }

      const formatCurrency = (val) => {
        return val.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

      return {
        id: r.id.toString(),
        fecha: r.fecha,
        status: statusBadge,
        statusDoc: statusDoc,
        login: r.login,
        cliente: r.cliente || 'Consumidor Final',
        ordenVenta: r.ordenVenta ? 'OV-' + r.ordenVenta : 'S/O',
        subtotal: '$' + formatCurrency(subtotal),
        iva: '$' + formatCurrency(iva),
        total: '$' + formatCurrency(total),
        serie: r.serie || 'MLLNI',
        factura: r.factura || '',
        obsCliente: r.obsCliente,
        obsNieto: r.obsNieto
      };
    });

    res.json(formattedRows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * =========================================================================
 * DETALLE DE PEDIDO (MODAL DETALLADO)
 * =========================================================================
 * Retorna las 3 pestañas: General, Detalle y Surtimiento.
 */
app.get('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [headerRows] = await pool.query(`
      SELECT 
        v.*, DATE_FORMAT(v.VentaFecha, '%d/%m/%Y') as fecha_fmt, DATE_FORMAT(v.VentaHoraSolicitud, '%d/%m/%Y %h:%i %p') as solicitud_fmt,
        DATE_FORMAT(v.VentaHoraFactura, '%d/%m/%Y %h:%i %p') as factura_fmt, DATE_FORMAT(v.VentaHoraAlmacen, '%d/%m/%Y %h:%i %p') as almacen_fmt,
        DATE_FORMAT(v.VentaHoraEntrega, '%d/%m/%Y %h:%i %p') as entrega_fmt, DATE_FORMAT(v.VentaHoraRecepcion, '%d/%m/%Y %h:%i %p') as recepcion_fmt,
        DATE_FORMAT(v.VentaHoraTransito, '%d/%m/%Y %h:%i %p') as transito_fmt, u.UsuarioNombre as cliente_nombre, u.PerfilId as perfil_id,
        v.UsuarioLogin as no_cliente, s.SucursalAbreviacion as sucursal_nombre
      FROM venta v
      LEFT JOIN usuario u ON v.UsuarioLogin = u.usuariologin
      LEFT JOIN sucursal s ON u.SucursalId = s.SucursalId
      WHERE v.VentaId = ?
    `, [id]);

    if (headerRows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const h = headerRows[0];
    
    const [detailRows] = await pool.query(`
        SELECT vd.*, a.ALMNOM as descrip, a.almplist as plist 
        FROM ventadetalle vd 
        LEFT JOIN almcat a ON vd.almcve = a.almcve 
        WHERE vd.VentaId = ?
    `, [id]);

    const [surtRows] = await pool.query(`
        SELECT vs.*, a.ALMNOM as nom, g.grumar as mar, g.grucve as gru 
        FROM ventasurtimiento vs 
        LEFT JOIN almcat a ON vs.SurtimientoClave = a.almcve 
        LEFT JOIN almgru g ON a.grucve = g.grucve 
        WHERE vs.VentaId = ?
    `, [id]);

    const formatCurrency = (val) => (parseFloat(val) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    let st = 0, it = 0;
    
    const items = detailRows.map(d => {
      const imp = (d.VentaDetalleCan || 0) * (parseFloat(d.VentaDetallePV) || 0);
      const ivi = d.VentaDetalleIva === 'S' ? imp * 0.16 : 0;
      st += imp; 
      it += ivi;

      return {
        clave: d.almcve, 
        descripcion: d.descrip, 
        iva: d.VentaDetalleIva, 
        cantidad: d.VentaDetalleCan,
        venta: '$' + formatCurrency(d.VentaDetallePV), 
        iva_importe: '$' + formatCurrency(ivi),
        subtotal: '$' + formatCurrency(imp), 
        costo: '$' + formatCurrency(d.VentaDetalleMFPCos),
        p_lista: '$' + formatCurrency(d.plist), 
        original: d.VentaDetalleOriginal || 0,
        mfdescncp: '$' + formatCurrency(d.VentaDetallemfdescncp), 
        pvn: '$' + formatCurrency(d.VentaDetallePV)
      };
    });

    res.json({
      header: {
        id: h.VentaId, fecha: h.fecha_fmt, status: h.VentaStatus, login: h.UsuarioLogin, no_cliente: h.no_cliente, 
        orden_venta: h.VentaOrden, subtotal: '$' + formatCurrency(st), iva: '$' + formatCurrency(it), total: '$' + formatCurrency(st + it),
        tipo: h.VentaTipo, tipo_bool: h.VentaStatusTipo ? 'true' : 'false', observaciones: h.VentaObservaciones, id_c: h.VentaIdC,
        serie: h.VentaSerie || 'MLLNI', factura: h.VentaFactura || '', status_desc: h.VentaStatusInterno || 'N/A',
        solicitud: h.solicitud_fmt || '-', factura_hora: h.factura_fmt || '-', almacen: h.almacen_fmt || '-',
        entrega: h.entrega_fmt || '-', recepcion: h.recepcion_fmt || '-', transito: h.transito_fmt || '-',
        ruta: h.VentaRuta || '-', vehiculo: h.VentaVehiculo || '-', usuario_nombre: h.cliente_nombre,
        perfil_id: h.perfil_id || '0', observacion_n: h.VentaObservacion, sucursal: h.sucursal_nombre,
        recibio: h.VentaRecibio || '-', surtimiento: h.VentaSurtimiento || '0'
      },
      items,
      surtimiento: surtRows.map(s => ({
        clave: s.SurtimientoClave, actual: s.SurtimientoActual, nombre: s.nom,
        terminado: s.SurtimientoTerminado === 1, pedido: s.SurtimientoPedido,
        porcentaje_inicial: s.SurtimientoPorcentajeInicial, porcentaje_actual: s.SurtimientoPorcentajeActual,
        marca: s.mar, grupo: s.gru
      }))
    });

  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});


/**
 * =========================================================================
 * FUNCIONES DE COTIZACIONES
 * =========================================================================
 * Gestión de borradores de cotización para clientes.
 */
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

app.post('/api/cotizaciones', async (req, res) => {
  const { UsuarioLogin, nclicve, nclinom, ncategcve, nclidcred, nclimail } = req.body;
  try {
    const d = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
      'INSERT INTO Cotizacion (CotizacionFecha, UsuarioLogin, nclicve, nclinom, ncategcve, nclidcred, nclimail) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [d, UsuarioLogin, nclicve || 0, nclinom || '', ncategcve || 1, nclidcred || 0, nclimail || '']
    );
    res.json({ success: true, CotizacionId: result.insertId });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});

app.put('/api/cotizaciones/:id', async (req, res) => {
  const { id } = req.params;
  const { nclicve, nclinom, nclimail } = req.body;
  try {
    await pool.query('UPDATE Cotizacion SET nclicve = ?, nclinom = ?, nclimail = ? WHERE CotizacionId = ?', [nclicve || 0, nclinom, nclimail, id]);
    res.json({ success: true });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});

app.post('/api/cotizaciones/:id/items', async (req, res) => {
  const { id } = req.params;
  const { clave, concepto, cantidad, precio, justificacion, tipo, iva } = req.body;
  
  try {
    const [exists] = await pool.query('SELECT CotizacionDetalleCantidad FROM CotizacionDetalle WHERE CotizacionId = ? AND CotizacionDetalleClave = ?', [id, clave]);
    
    if (exists.length > 0) {
      await pool.query('UPDATE CotizacionDetalle SET CotizacionDetalleCantidad = ? WHERE CotizacionId = ? AND CotizacionDetalleClave = ?', [exists[0].CotizacionDetalleCantidad + (cantidad || 1), id, clave]);
    } else {
      await pool.query('INSERT INTO CotizacionDetalle (CotizacionId, CotizacionDetalleClave, CotizacionDetalleConcepto, CotizacionDetalleCantidad, CotizacionDetallePrecio, CotizacionDetalleJustificacion, CotizacionDetalleTipo, CotizacionDetalleIva) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, clave, concepto, cantidad || 1, precio || 0, justificacion || '', tipo || 'A', iva || 'S']);
    }
    
    res.json({ success: true });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});


// --- NUEVO: ENDPOINT DE CHAT CON IA (CON FUNCTION CALLING Y REGLAS ESTRICTAS) ---
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

  try {
    const systemPrompt = `INSTRUCCIONES CRÍTICAS PARA EL ASISTENTE NIETO:
1. Eres un ASISTENTE TÉCNICO INFORMATIVO. Tu único objetivo es proveer datos, precios y existencias.
2. PROHIBIDO: Bajo ninguna circunstancia menciones "comprar", "añadir al carrito", "realizar pedido" o "generar venta". Eres solo un informador visual.
3. Si el usuario saluda ("hola", "qué tal"), responde muy brevemente: "¡Hola! Soy tu asistente. ¿En qué información técnica puedo ayudarte hoy?" y NO repitas este saludo después.
4. Si detectas que el usuario quiere "VER" (ej: "muéstrame llantas 295/80"), genera una respuesta amable pero SIEMPRE incluye al final un bloque JSON con los filtros detectados: {"filters": {"ancho": "...", "rin": "...", "marca": ["..."]}}.
5. Usa las herramientas buscarProductos y consultarExistencias para dar PRECIOS Y STOCK REAL cuando te lo pregunten.`;

    const chat = model.startChat({
      history: (history || [])
        .filter((h, idx) => idx > 0 || h.role === 'user')
        .map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
    });

    // Enviar instrucción + mensaje
    let result = await chat.sendMessage(systemPrompt + "\n\nUSUARIO: " + message);
    let response = result.response;
    let parts = response.candidates[0].content.parts;
    let call = parts.find(p => p.functionCall);

    // Manejo de llamadas a funciones (Bucle de herramientas)
    while (call) {
      const { name, args } = call.functionCall;
      let functionResponseData;

      if (name === "buscarProductos") {
        // Hacemos la búsqueda más flexible (convierte espacios/barras en comodines %)
        const flexibleQuery = args.query.replace(/[\/\s-]/g, '%');
        const [rows] = await pool.query(
          "SELECT a.ALMNOM as Descripcion, a.almcve as Clave, a.almstat as Status, a.almplist as Precio FROM almcat a WHERE a.ALMNOM LIKE ? OR a.almcve LIKE ? LIMIT 5",
          [`%${flexibleQuery}%`, `%${args.query}%`]
        );
        functionResponseData = rows;
      } 
      else if (name === "consultarExistencias") {
        const [rows] = await pool.query(
          "SELECT s.SucursalAbreviacion as Sucursal, sa.almstock as Stock FROM sucursalarticulo sa JOIN sucursal s ON sa.SucursalId = s.SucursalId WHERE sa.almcve = ? AND sa.almstock > 0",
          [args.clave]
        );
        functionResponseData = rows;
      }

      // Devolver el resultado a la IA para que formule la respuesta final
      result = await chat.sendMessage([{
        functionResponse: {
          name: name,
          response: { content: functionResponseData }
        }
      }]);
      
      response = result.response;
      parts = response.candidates[0].content.parts;
      call = parts.find(p => p.functionCall);
    }

    const finalResponse = response.text();
    res.json({ response: finalResponse });

  } catch (error) {
    console.error('Error Gemini Advanced:', error);
    res.status(500).json({ error: 'Error en Asistente: ' + error.message });
  }
});


/**
 * =========================================================================
 * INICIO DEL SERVIDOR
 * =========================================================================
 */
app.listen(4000, '0.0.0.0', () => {



    console.log('API Multillantas Nieto corriendo en puerto 4000 (v550 lines + AI)');
});
