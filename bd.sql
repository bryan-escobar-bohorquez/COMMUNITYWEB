
 -- Usar la base de datos 
 USE albiweb; 
 -- Crear la tabla de Usuarios 
 CREATE TABLE Usuario ( id_usuario INT PRIMARY KEY AUTO_INCREMENT, nombre VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, contraseña VARCHAR(255) NOT NULL, tipo_usuario ENUM('empleador', 'trabajador', 'usuario') NOT NULL );
 -- Crear la tabla de Empleos 
 CREATE TABLE Empleo ( id_empleo INT PRIMARY KEY AUTO_INCREMENT, titulo VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, salario DECIMAL(10,2) NOT NULL, ubicacion VARCHAR(255) NOT NULL, fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, id_usuario INT NOT NULL, FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE ); 
-- Crear la tabla de Postulaciones 
CREATE TABLE Postulacion ( id_postulacion INT PRIMARY KEY AUTO_INCREMENT, id_usuario INT NOT NULL, id_empleo INT NOT NULL, estado ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente', fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE, FOREIGN KEY (id_empleo) REFERENCES Empleo(id_empleo) ON DELETE CASCADE ); 


 -- Crear la tabla de Órdenes
 CREATE TABLE Orden ( id_orden INT PRIMARY KEY AUTO_INCREMENT, id_usuario INT NOT NULL, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, total DECIMAL(10,2) NOT NULL, FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE );
 -- Crear la tabla intermedia para la relación N:M entre Órdenes y Materiales 
 CREATE TABLE Orden_Material ( id_orden INT NOT NULL, id_material INT NOT NULL, cantidad INT NOT NULL, PRIMARY KEY (id_orden, id_material), FOREIGN KEY (id_orden) REFERENCES Orden(id_orden) ON DELETE CASCADE, FOREIGN KEY (id_material) REFERENCES Material(id_material) ON DELETE CASCADE );
 -- Crear la tabla de Pagos 
 CREATE TABLE Pago ( id_pago INT PRIMARY KEY AUTO_INCREMENT, id_orden INT NOT NULL, monto DECIMAL(10,2) NOT NULL, metodo_pago ENUM('tarjeta', 'PayPal', 'transferencia') NOT NULL, estado ENUM('pendiente', 'completado') DEFAULT 'pendiente', FOREIGN KEY (id_orden) REFERENCES Orden(id_orden) ON DELETE CASCADE );
CREATE TABLE Material (
    id_material INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_usuario INT NOT NULL
);

-- 2. Añadir la columna 'imagen' (opcional, si no se incluyó en el CREATE TABLE inicial)
ALTER TABLE Material ADD COLUMN imagen VARCHAR(255);

-- 3. Añadir la clave foránea (si la tabla Usuario existe)
ALTER TABLE Material ADD CONSTRAINT fk_material_usuario 
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) 
    ON DELETE CASCADE;