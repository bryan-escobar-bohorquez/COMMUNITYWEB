const pool =require('../config/db');

exports.agregarAlCarrito = async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = 1;
  
    try {
      const [rows] = await pool.query(
        'SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?',
        [usuario_id, producto_id]
      );
  
      if (rows.length > 0) {
        await pool.query(
          'UPDATE carrito SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?',
          [cantidad || 1, usuario_id, producto_id]
        );
      } else {
        await pool.query(
          'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [usuario_id, producto_id, cantidad || 1]
        );
      }
  
      res.status(201).json({ mensaje: 'Producto añadido al carrito' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al añadir al carrito' });
    }
  };
  
  exports.obtenerCarrito = async (req, res) => {
    const usuario_id = 1;
  
    try {
      const [items] = await pool.query(`
        SELECT c.id, p.nombre, p.precio, p.imagen_url, c.cantidad, p.id AS producto_id
        FROM carrito c
        JOIN productos p ON c.producto_id = p.id
        WHERE c.usuario_id = ?
      `, [usuario_id]);
  
      res.json(items);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al obtener el carrito' });
    }
  };
  
  exports.eliminarDelCarrito = async (req, res) => {
    const { productoId } = req.params;
    const usuario_id = 1;
  
    try {
      await pool.query(
        'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?',
        [usuario_id, productoId]
      );
      res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al eliminar del carrito' });
    }
  };

  exports.actualizarCantidad = async (req, res) => {
    const { productoId } = req.params;
    const { cambio } = req.body;
    const usuarioId = 1; // Usuario estático por ahora

    if (![1, -1].includes(cambio)) {
        return res.status(400).json({ error: 'Cambio inválido. Debe ser 1 o -1.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
            [usuarioId, productoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        const nuevaCantidad = rows[0].cantidad + cambio;

        if (nuevaCantidad <= 0) {
            await db.query(
                'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?',
                [usuarioId, productoId]
            );
        } else {
            await db.query(
                'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?',
                [nuevaCantidad, usuarioId, productoId]
            );
        }
        
        res.json({ mensaje: 'Cantidad actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la cantidad:', err);
        res.status(500).json({ error: 'Error del servidor' });
    }

  };


  exports.vaciarCarrito = async (req, res) => {
    const  usuarioId  = 1

    try {
        const [result] = await pool.query(
            'DELETE FROM carrito WHERE usuario_id = ?',
            [usuarioId]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Carrito vaciado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'No se encontró carrito para este usuario' });
        }
    } catch (err) {
        console.error("Error al vaciar el carrito:", err);
        res.status(500).json({ mensaje: 'Error al vaciar el carrito en la base de datos' });
    }
};




  
