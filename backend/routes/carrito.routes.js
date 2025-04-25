const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');

router.get('/', carritoController.obtenerCarrito);
router.post('/', carritoController.agregarAlCarrito);
router.put('/actualizar/:productoId', carritoController.actualizarCantidad);
router.delete('/:productoId', carritoController.eliminarDelCarrito);
router.delete('/carrito/vaciar', carritoController.vaciarCarrito);

module.exports = router;
