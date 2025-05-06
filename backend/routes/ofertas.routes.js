// backend/Database/routes/oferta.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Debe ser un pool o conexión desde mysql2/promise

// Obtener todas las ofertas
router.get('/', async (req, res) => {
  try {
    const [resultados] = await db.query('SELECT * FROM ofertas');
    res.json(resultados);
  } catch (err) {
    console.error('Error al obtener ofertas:', err);
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
});

// Publicar una nueva oferta
router.post('/', async (req, res) => {
  const { titulo, categoria, ubicacion, precio, contacto, descripcion } = req.body;

  if (!titulo || !categoria || !ubicacion || !precio || !contacto || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = `
    INSERT INTO ofertas (titulo, categoria, ubicacion, precio, contacto, descripcion) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const valores = [titulo, categoria, ubicacion, precio, contacto, descripcion];

  try {
    const [resultado] = await db.query(sql, valores);
    res.status(201).json({ id: resultado.insertId, ...req.body });
  } catch (err) {
    console.error('Error al insertar oferta:', err);
    res.status(500).json({ error: 'Error al insertar oferta' });
  }
});

module.exports = router;
