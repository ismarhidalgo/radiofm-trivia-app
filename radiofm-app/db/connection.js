require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect(err => {
  if (err) {
    console.error('❌ Error al conectar con PostgreSQL:', err);
  } else {
    console.log('🟢 Conectado a PostgreSQL con éxito');
  }
});

module.exports = pool;