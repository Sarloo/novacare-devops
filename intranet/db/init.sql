CREATE DATABASE IF NOT EXISTS novacare_intranet;
USE novacare_intranet;

CREATE TABLE IF NOT EXISTS bitacora (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empleado VARCHAR(100),
  actividad TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
