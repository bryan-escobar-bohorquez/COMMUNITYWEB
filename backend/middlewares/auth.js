const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, acceso denegado' });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};