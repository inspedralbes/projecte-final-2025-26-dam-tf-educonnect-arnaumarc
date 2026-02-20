-- Crear tabla de Profesores
CREATE TABLE IF NOT EXISTS `profesores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dni` VARCHAR(9) UNIQUE NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `especialidad` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear tabla de Alumnos
CREATE TABLE IF NOT EXISTS `alumnos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `clase` VARCHAR(20) NOT NULL,
  `tipo_horario` VARCHAR(50) NOT NULL,
  `tutor_id` INT,
  FOREIGN KEY (`tutor_id`) REFERENCES `profesores`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de prueba
INSERT INTO `profesores` (dni, nombre, apellidos, email, password, especialidad) VALUES
('12345678A', 'Xavier', 'García', 'xavi@inspedralbes.cat', 'xavi@inspedralbes.cat', 'Programación');

INSERT INTO `alumnos` (nombre, apellidos, email, password, clase, tipo_horario, tutor_id) VALUES
('Arnau', 'Perera Ganuza', 'a24arnpergan@inspedralbes.cat', 'a24arnpergan@inspedralbes.cat', '2DAM', 'Mañana', 1),
('Marc', 'Cara Montes', 'a24marcarmon@inspedralbes.cat', 'a24marcarmon@inspedralbes.cat', '2DAM', 'Mañana', 1);