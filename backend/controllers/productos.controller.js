const pool =require('../config/db');

// Obtener productos por categoría
exports.obtenerPorCategoria = async (req, res) => {
  const categoria = req.params.categoria;

  try {
    const [productos] = await pool.query(
      'SELECT * FROM productos WHERE categoria = ? AND stock > 0',
      [categoria]
    );

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ mensaje: 'Error al obtener los productos por categoría' });
  }
};

exports.obtenerProductos = async (req, res) => {
    try {
      const [productos] = await pool.query('SELECT * FROM productos WHERE stock > 0');
      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos' });
    }
  };
  
  exports.agregarProducto = async (req, res) => {
    const { nombre, descripcion, precio, imagen_url, categoria, stock } = req.body;
    try {
      await pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, imagen_url, categoria, stock]
      );
      res.status(201).json({ mensaje: 'Producto agregado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al agregar producto' });
    }
  };
  
  exports.editarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen_url, categoria, stock } = req.body;
    try {
      await pool.query(
        'UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen_url=?, categoria=?, stock=? WHERE id=?',
        [nombre, descripcion, precio, imagen_url, categoria, stock, id]
      );
      res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }
  };
  
  exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM productos WHERE id = ?', [id]);
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
  };

 
  exports.obtenerDestacados = async (req, res) => {
    try {
      const [productos] = await pool.query(
        'SELECT * FROM productos WHERE stock <= 15'
      );
      res.json(productos);
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      res.status(500).json({ mensaje: 'Error al obtener productos destacados' });
    }
  };

 /* exports.buscarProductos = async (req, res) => {
    const { termino } = req.query;
  
    try {
        const [productos] = await pool.query(
            `SELECT * FROM productos 
             WHERE LOWER(nombre) LIKE LOWER(?)`,
            [`%${termino}%`]
        );
        
        res.json(productos.length > 0 ? productos : { mensaje: "No se encontraron resultados" });
        
    } catch (err) {
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
  };*/

  // En el backend (productosController.js)
exports.buscarProductos = async (req, res) => {
  const termino = req.query.termino || '';
  
  try {
      const [productos] = await pool.query(
          `SELECT * FROM productos 
           WHERE nombre LIKE ? 
           AND stock > 0`,
          [`%${termino}%`]
      );
      
      res.json(productos.length > 0 ? productos : []);
      
  } catch (err) {
      console.error("Error en búsqueda:", err);
      res.status(500).json({ error: 'Error en el servidor' });
  }
};
  