-- Crear tablas

CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_sesion (
    id SERIAL PRIMARY KEY,
    correo INT NOT NULL UNIQUE,
    token INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Departamento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Instalaciones(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    rol_id INT,
    departamento_id INT,
    token_recuperacion VARCHAR(255),
    fecha_expiracion_token TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES Rol(id),
    FOREIGN KEY (departamento_id) REFERENCES Departamento(id)
);

-- Crear la tabla Direccion
CREATE TABLE Direccion (
    id SERIAL PRIMARY KEY,
    Abreviatura VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Carrera
CREATE TABLE Carrera (
    id SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    perfil_profesional TEXT,
    ocupacion_profesional TEXT,
    direccion_id INT,  -- Cambié el nombre de la columna a "direccion_id"
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (direccion_id) REFERENCES Direccion(id)  -- Añadí la restricción de clave externa
);

CREATE TABLE Cuatrimestre (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    carrera_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrera_id) REFERENCES Carrera(id)
);

CREATE TABLE Asignatura (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cuatrimestre_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuatrimestre_id) REFERENCES Cuatrimestre(id)
);

-- Crear tabla general para imágenes
CREATE TABLE Imagenes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ruta_imagen VARCHAR(255) NOT NULL,
    seccion VARCHAR(50) NOT NULL, -- Identifica a qué sección pertenece la imagen (carrera, evento, taller,Instalaciones etc.)
    asociado_id INT, -- ID del registro en la tabla correspondiente
    principal BOOLEAN DEFAULT FALSE, -- Indica si la imagen es principal
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla general para archivos
CREATE TABLE Archivos (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50) NOT NULL, 
    seccion VARCHAR(50) NOT NULL, -- Identifica a qué sección pertenece el archivo (asignatura, evento, calendario, etc.)
    asociado_id INT, -- ID del registro en la tabla correspondiente
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Evento (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    informacion_evento TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    lugar_evento VARCHAR(50) NOT NULL,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    hora_inicio TIME,
    hora_fin TIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE Noticia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    resumen TEXT,
    informacion_noticia TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    lugar_noticia VARCHAR(50) NOT NULL,
    autor VARCHAR(50),
    fecha_publicacion DATE DEFAULT CURRENT_DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Calendario (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    archivo VARCHAR(10000) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BolsaDeTrabajo (
    id SERIAL PRIMARY KEY,
    titulo_trabajo VARCHAR(50) NOT NULL,
    informacion_oferta TEXT NOT NULL,
    correo_empresa VARCHAR(100),
    tipo VARCHAR(50) NOT NULL, -- 'EMPRESA' o 'PROFESORES'
    telefono_empresa VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    id_direccion INT,
    FOREIGN KEY (id_direccion) references Direccion(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Taller (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    competencia VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Beca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    archivo VARCHAR(10000) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Historial (
    id SERIAL PRIMARY KEY,
    tabla VARCHAR(50) NOT NULL,
    operacion VARCHAR(10) NOT NULL,
    registro_id INT NOT NULL,
    datos_anteriores JSONB,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora TIME NOT NULL DEFAULT CURRENT_TIME
);

-- Función y trigger para la tabla Usuario
CREATE OR REPLACE FUNCTION log_modificacion_usuario()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Usuario', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Usuario', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Usuario', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuario
AFTER INSERT OR UPDATE OR DELETE ON Usuario
FOR EACH ROW EXECUTE FUNCTION log_modificacion_usuario();

-- Función y trigger para la tabla Carrera
CREATE OR REPLACE FUNCTION log_modificacion_carrera()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Carrera', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Carrera', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Carrera', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_carrera
AFTER INSERT OR UPDATE OR DELETE ON Carrera
FOR EACH ROW EXECUTE FUNCTION log_modificacion_carrera();

-- Función y trigger para la tabla Cuatrimestre
CREATE OR REPLACE FUNCTION log_modificacion_cuatrimestre()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Cuatrimestre', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Cuatrimestre', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Cuatrimestre', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cuatrimestre
AFTER INSERT OR UPDATE OR DELETE ON Cuatrimestre
FOR EACH ROW EXECUTE FUNCTION log_modificacion_cuatrimestre();

-- Función y trigger para la tabla Asignatura
CREATE OR REPLACE FUNCTION log_modificacion_asignatura()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Asignatura', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Asignatura', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Asignatura', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_asignatura
AFTER INSERT OR UPDATE OR DELETE ON Asignatura
FOR EACH ROW EXECUTE FUNCTION log_modificacion_asignatura();

-- Función y trigger para la tabla Archivos
CREATE OR REPLACE FUNCTION log_modificacion_archivo()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Archivos', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Archivos', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Archivos', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_archivo
AFTER INSERT OR UPDATE OR DELETE ON Archivos
FOR EACH ROW EXECUTE FUNCTION log_modificacion_archivo();


-- Función y trigger para la tabla Evento
CREATE OR REPLACE FUNCTION log_modificacion_evento()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Evento', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Evento', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Evento', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_evento
AFTER INSERT OR UPDATE OR DELETE ON Evento
FOR EACH ROW EXECUTE FUNCTION log_modificacion_evento();

-- Función y trigger para la tabla BolsaDeTrabajo
CREATE OR REPLACE FUNCTION log_modificacion_bolsadetrabajo()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('BolsaDeTrabajo', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('BolsaDeTrabajo', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('BolsaDeTrabajo', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bolsadetrabajo
AFTER INSERT OR UPDATE OR DELETE ON BolsaDeTrabajo
FOR EACH ROW EXECUTE FUNCTION log_modificacion_bolsadetrabajo();

-- Función y trigger para la tabla Rol
CREATE OR REPLACE FUNCTION log_modificacion_rol()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Rol', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Rol', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Rol', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rol
AFTER INSERT OR UPDATE OR DELETE ON Rol
FOR EACH ROW EXECUTE FUNCTION log_modificacion_rol();

-- Función y trigger para la tabla Departamento
CREATE OR REPLACE FUNCTION log_modificacion_departamento()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Departamento', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Departamento', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Departamento', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_departamento
AFTER INSERT OR UPDATE OR DELETE ON Departamento
FOR EACH ROW EXECUTE FUNCTION log_modificacion_departamento();

-- Función y trigger para la tabla Direccion
CREATE OR REPLACE FUNCTION log_modificacion_direccion()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Direccion', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Direccion', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Direccion', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_direccion
AFTER INSERT OR UPDATE OR DELETE ON Direccion
FOR EACH ROW EXECUTE FUNCTION log_modificacion_direccion();

-- Crear índices
CREATE INDEX idx_usuario_correo ON Usuario (correo);
CREATE INDEX idx_carrera_nombre ON Carrera (nombre_carrera);
CREATE INDEX idx_evento_fecha ON Evento (fecha_inicio);
CREATE INDEX idx_bolsadetrabajo_fecha_creacion ON BolsaDeTrabajo (fecha_creacion);

