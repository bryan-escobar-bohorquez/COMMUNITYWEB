

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(15),
    password VARCHAR(255),
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255),
    categoria VARCHAR(100),
    stock INT NOT NULL
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
 -- Tabla para los pedidos
CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla para los productos de cada pedido
CREATE TABLE ordenes_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);