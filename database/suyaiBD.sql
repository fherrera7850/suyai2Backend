-- Crear tabla rol
CREATE TABLE rol (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    descripcionRol VARCHAR(255) NOT NULL
);

-- Crear tabla usuario
CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    idRol INT,
    nombreUsuario VARCHAR(255) NOT NULL,
    passwordUsuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL,
    FOREIGN KEY (idRol) REFERENCES rol(idRol)
);

-- Crear tabla producto
CREATE TABLE producto (
    idProducto INT PRIMARY KEY AUTO_INCREMENT,
    descripcionProducto VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    activo BOOLEAN NOT NULL
);

-- Crear tabla carrito
CREATE TABLE carrito (
    idCarrito INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT,
    idProducto INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);

-- Crear tabla pedido
CREATE TABLE pedido (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    idCarrito INT,
    idUsuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(255),
    comentario TEXT,
    monto DECIMAL(10, 2),
    FOREIGN KEY (idCarrito) REFERENCES carrito(idCarrito),
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

-- Crear tabla detallePedido
CREATE TABLE detallePedido (
    idDetallePedido INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT,
    idProducto INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedido(idPedido),
    FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);

INSERT INTO `rol` (`idRol`, `descripcionRol`) VALUES
(1, 'administrador'),
(2, 'revisor'),
(3, 'cliente');

INSERT INTO `usuario` (`idUsuario`, `idRol`, `nombreUsuario`, `passwordUsuario`, `email`, `direccion`, `telefono`, `activo`) VALUES
(1, 1, 'admin', '123456', 'admin@suyai.com', NULL, NULL, 1),
(2, 3, 'felipe', '123456', 'felipe@suyai.com', NULL, NULL, 0);

-- Agregar columna nombreProducto a la tabla producto
ALTER TABLE producto
ADD COLUMN nombreProducto VARCHAR(50) AFTER idProducto;
