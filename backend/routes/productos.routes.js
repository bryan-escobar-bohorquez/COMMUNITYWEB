const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

// Ruta para productos por categoría (debe ir antes de /:id)
router.get('/categoria/:categoria', productosController.obtenerPorCategoria);
router.get('/destacados', productosController.obtenerDestacados);
router.get('/productos/buscar', productosController.buscarProductos);

// CRUD general
router.get('/', productosController.obtenerProductos);
router.post('/', productosController.agregarProducto);
router.put('/:id', productosController.editarProducto);
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;
