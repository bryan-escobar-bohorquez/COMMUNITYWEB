const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

exports.verificarToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, acceso denegado' });
  }

  // Verifica que el JWT_SECRET esté configurado
  if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET no está definido en las variables de entorno');
    return res.status(500).json({ mensaje: 'Error de configuración del servidor' });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado.usuario;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    
    let mensaje = 'Token no válido';
    if (error.name === 'TokenExpiredError') {
      mensaje = 'Token expirado';
    } else if (error.name === 'JsonWebTokenError') {
      mensaje = 'Token malformado';
    }
    
    res.status(401).json({ mensaje });
  }
};