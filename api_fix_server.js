const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto'); // Para MD5
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Función para cifrar en MD5 (como suele hacer GeneXus)
const toMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex').toUpperCase();
};

// --- ENDPOINT: LOGIN ---
app.post('/api/login', async (req, res) => {
  const { user, password } = req.body;
  console.log(`Intento de login para: ${user}`);
  
  try {
    const passwordMD5 = toMD5(password);
    
    // Intentamos buscar por usuariologin (el campo de GeneXus)
    // Probamos tanto el password plano como el MD5 por si acaso
    const [rows] = await pool.query(
      'SELECT usuariologin, UsuarioNombre, SucursalId FROM usuario WHERE usuariologin = ? AND (UsuarioPassword = ? OR UsuarioPassword = ?)',
      [user, password, passwordMD5]
    );

    if (rows.length > 0) {
      console.log(`Login exitoso: ${rows[0].UsuarioNombre}`);
      res.json({ success: true, user: rows[0] });
    } else {
      console.log(`Login fallido para user: ${user}`);
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT: BÚSQUEDA DE EXISTENCIAS (FILTROS) ---
app.get('/api/existencias/search', async (req, res) => {
  const { ancho, serie, rin, nombre, marca } = req.query;
  try {
    let query = 'SELECT almcve, ALMNOM, almancho, almserie, almrin, almprec, almdisponible FROM almcat WHERE 1=1';
    const params = [];

    if (ancho) { query += ' AND almancho = ?'; params.push(ancho); }
    if (serie) { query += ' AND almserie = ?'; params.push(serie); }
    if (rin) { query += ' AND almrin = ?'; params.push(rin); }
    if (nombre) { query += ' AND ALMNOM LIKE ?'; params.push(`%${nombre}%`); }
    if (marca && marca !== 'TODOS') { query += ' AND ALMNOM LIKE ?'; params.push(`%${marca}%`); }

    query += ' LIMIT 100';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT: PEDIDOS ---
app.get('/api/pedidos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedido ORDER BY PedidoFec DESC LIMIT 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Existencias corriendo en puerto ${PORT}`);
});
