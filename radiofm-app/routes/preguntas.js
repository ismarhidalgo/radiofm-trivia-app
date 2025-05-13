const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Obtener todas las preguntas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM preguntas_radio');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al consultar la base:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;