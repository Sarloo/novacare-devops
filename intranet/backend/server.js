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

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'novacare_intranet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  writeLog('INFO', 'Dashboard privado consultado correctamente');
  res.json({
    empleados: 24,
    citas: 138,
    estado: 'Operativo'
  });
});

app.post('/api/bitacora', async (req, res) => {
  const { empleado, actividad } = req.body;

  if (!empleado || !actividad) {
    writeLog('ERROR', 'Intento de bitacora con datos incompletos');
    return res.status(400).json({ message: 'Empleado y actividad son obligatorios.' });
  }

  try {
    await pool.execute(
      'INSERT INTO bitacora (empleado, actividad) VALUES (?, ?)',
      [empleado, actividad]
    );
    writeLog('INFO', `Actividad interna guardada para ${empleado}`);
    res.status(201).json({ message: 'Actividad interna guardada correctamente.' });
  } catch (error) {
    writeLog('ERROR', `Fallo al guardar bitacora en MySQL: ${error.message}`);
    res.status(500).json({ message: 'No se pudo guardar la actividad interna.' });
  }
});

app.get('/api/error', (req, res) => {
  writeLog('ERROR', 'ERROR simulado en intranet para prueba de CloudWatch');
  res.json({ message: 'ERROR simulado registrado en logs de intranet.' });
});

app.listen(PORT, () => {
  writeLog('INFO', `Backend privado iniciado en puerto ${PORT}`);
});
