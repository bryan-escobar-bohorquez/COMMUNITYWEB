require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'El servidor está funcionando correctamente'});
});


// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});