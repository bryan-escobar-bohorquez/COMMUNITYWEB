const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registrar nuevo usuario
router.post('/registro', authController.registrar);

// Iniciar sesión
router.post('/login', authController.iniciarSesion);

// Menu principal 



module.exports = router;