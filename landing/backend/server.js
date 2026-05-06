const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = '/app/logs';
const LOG_FILE = path.join(LOG_DIR, 'app.log');

fs.mkdirSync(LOG_DIR, { recursive: true });
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

function writeLog(level, message) {
  const line = `${new Date().toISOString()} [${level}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, line);
}

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'novacare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  writeLog('INFO', 'Consulta de salud recibida en backend publico');
  res.json({ status: 'ok', message: 'Backend publico de NovaCare funciona correctamente.' });
});

app.post('/api/contact', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    writeLog('ERROR', 'Intento de contacto con datos incompletos');
    return res.status(400).json({ message: 'Nombre, correo y mensaje son obligatorios.' });
  }

  try {
    await pool.execute(
      'INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)',
      [nombre, correo, mensaje]
    );
    writeLog('INFO', `Contacto guardado correctamente para ${correo}`);
    res.status(201).json({ message: 'Mensaje guardado correctamente en NovaCare.' });
  } catch (error) {
    writeLog('ERROR', `Fallo al guardar contacto en MySQL: ${error.message}`);
    res.status(500).json({ message: 'No se pudo guardar el contacto.' });
  }
});

app.get('/api/error', (req, res) => {
  writeLog('ERROR', 'ERROR simulado en landing para prueba de CloudWatch');
  res.json({ message: 'ERROR simulado registrado en logs de landing.' });
});

app.listen(PORT, () => {
  writeLog('INFO', `Backend publico iniciado en puerto ${PORT}`);
});
