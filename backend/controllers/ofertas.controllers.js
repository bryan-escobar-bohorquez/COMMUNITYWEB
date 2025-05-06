// controllers/ofertas.controller.js
const db = require("./config/db"); 

const crearOferta = (req, res) => {
  const { titulo, descripcion, categoria, precio, ubicacion, contacto } = req.body;
  if (!titulo || !descripcion || !categoria || !precio || !ubicacion || !contacto) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = `INSERT INTO ofertas (titulo, descripcion, categoria, precio, ubicacion, contacto)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [titulo, descripcion, categoria, precio, ubicacion, contacto], (err, result) => {
    if (err) return res.status(500).json({ mensaje: "Error al guardar oferta", error: err });
    res.status(201).json({ mensaje: "Oferta guardada correctamente", id: result.insertId });
  });
};

const obtenerOfertas = (req, res) => {
  db.query("SELECT * FROM ofertas", (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener ofertas", error: err });
    res.json(results);
  });
};

module.exports = { crearOferta, obtenerOfertas };
