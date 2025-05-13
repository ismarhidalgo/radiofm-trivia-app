const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // 👈 esta es la conexión que funciona

router.get('/', (req, res) => {
  db.query('SELECT * FROM preguntas_radio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;