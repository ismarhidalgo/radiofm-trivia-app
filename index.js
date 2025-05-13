const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
require('./radiofm-app/db/connection');

// Rutas API
const preguntasRoutes = require('./radiofm-app/routes/preguntas');
app.use('/api/preguntas', preguntasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});