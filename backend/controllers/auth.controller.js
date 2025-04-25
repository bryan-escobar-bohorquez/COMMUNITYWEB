const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar nuevo usuario con todos los campos
exports.registrar = async (req, res) => {
  const { 
    nombre, 
    email, 
    telefono, 
    password, 
    confirm_password, 
    fecha_nacimiento, 
    genero 
  } = req.body;

  try {
    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    }

    // Verificar si el usuario ya existe
    const [usuarioExistente] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    
    if (usuarioExistente.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Verificar si el teléfono ya existe
    const [telefonoExistente] = await pool.query(
      'SELECT * FROM usuarios WHERE telefono = ?', 
      [telefono]
    );
    
    if (telefonoExistente.length > 0) {
      return res.status(400).json({ mensaje: 'El teléfono ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con todos los campos
    const [resultado] = await pool.query(
      `INSERT INTO usuarios 
      (nombre, email, telefono, password, fecha_nacimiento, genero) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, email, telefono, passwordEncriptada, fecha_nacimiento, genero]
    );

    // Crear token JWT
    const payload = {
      usuario: {
        id: resultado.insertId,
        email: email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (error, token) => {
        if (error) throw error;
        res.status(201).json({ 
          token,
          usuario: {
            id: resultado.insertId,
            nombre,
            email,
            telefono,
            fecha_nacimiento,
            genero
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
// Iniciar sesión
exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    // Validar si existe el usuario
    if (usuarios.length === 0) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña usando el campo correcto ('password')
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const payload = {
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (error, token) => {
        if (error) throw error;
        res.json({ 
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            fecha_nacimiento: usuario.fecha_nacimiento,
            genero: usuario.genero
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en inicio de sesión:', error.message);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


  