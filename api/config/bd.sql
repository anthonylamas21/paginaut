-- Crear tablas

CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_sesion (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(50) NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Departamento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Instalaciones(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
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
    nombre VARCHAR(150) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla NivelesEstudios
CREATE TABLE NivelesEstudios (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla CampoEstudio
CREATE TABLE CampoEstudio (
    id SERIAL PRIMARY KEY,
    campo VARCHAR(150) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Carrera
CREATE TABLE Carrera (
    id SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(150) NOT NULL,
    perfil_profesional TEXT,
    ocupacion_profesional TEXT,
    direccion_id INT,
    nivel_estudio_id INT,
    campo_estudio_id INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (direccion_id) REFERENCES Direccion(id),
    FOREIGN KEY (nivel_estudio_id) REFERENCES NivelesEstudios(id),
    FOREIGN KEY (campo_estudio_id) REFERENCES CampoEstudio(id)
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
    nombre VARCHAR(150) NOT NULL,
    cuatrimestre_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuatrimestre_id) REFERENCES Cuatrimestre(id)
);

-- Crear tabla general para imágenes
CREATE TABLE Imagenes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    ruta_imagen VARCHAR(255) NOT NULL,
    seccion VARCHAR(50) NOT NULL, -- Identifica a qué sección pertenece la imagen (carrera, evento, taller, instalaciones, etc.)
    asociado_id INT, -- ID del registro en la tabla correspondiente
    principal BOOLEAN DEFAULT FALSE, -- Indica si la imagen es principal
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla general para archivos
CREATE TABLE Archivos (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(150) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(255) NOT NULL,
    seccion VARCHAR(50) NOT NULL, -- Identifica a qué sección pertenece el archivo (asignatura, evento, calendario, etc.)
    asociado_id INT, -- ID del registro en la tabla correspondiente
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Convocatoria (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,  -- Título de la convocatoria
    descripcion TEXT NOT NULL,  -- Información o detalles de la convocatoria
    activo BOOLEAN DEFAULT TRUE,  -- Indica si la convocatoria está activa o no
    lugar VARCHAR(150) NOT NULL,  -- Lugar donde se realizará la convocatoria
    fecha_inicio TIMESTAMP,  -- Fecha de inicio de la convocatoria
    fecha_fin TIMESTAMP,  -- Fecha de finalización de la convocatoria
    hora_inicio TIME,  -- Hora de inicio del evento de la convocatoria
    hora_fin TIME,  -- Hora de finalización del evento de la convocatoria
    es_curso BOOLEAN DEFAULT FALSE,  -- Indica si la convocatoria está asociada a un curso
    curso_id INT,  -- Referencia al curso relacionado (si aplica)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación de la convocatoria
    CONSTRAINT fk_curso FOREIGN KEY (curso_id) REFERENCES Curso(id) ON DELETE SET NULL  -- Clave externa a la tabla Curso
);


CREATE TABLE Convocatoria (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    lugar VARCHAR(150) NOT NULL,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    hora_inicio TIME,
    hora_fin TIME,
    es_curso BOOLEAN DEFAULT FALSE,  -- Indica si es un evento de curso o no
    curso_id INT,  -- Referencia al curso al que pertenece el evento, si aplica
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curso FOREIGN KEY (curso_id) REFERENCES Curso(id) ON DELETE SET NULL
);

CREATE TABLE Curso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Noticia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    resumen TEXT,
    informacion_noticia TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    lugar_noticia VARCHAR(150) NOT NULL,
    autor VARCHAR(50),
    fecha_publicacion DATE DEFAULT CURRENT_DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Calendario (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    archivo TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BolsaDeTrabajo (
    id SERIAL PRIMARY KEY,
    titulo_trabajo VARCHAR(150) NOT NULL,
    informacion_oferta TEXT NOT NULL,
    correo_empresa VARCHAR(100),
    tipo VARCHAR(50) NOT NULL, -- 'EMPRESA' o 'PROFESORES'
    telefono_empresa VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    id_direccion INT,
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Taller (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    competencia VARCHAR(150) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE beca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    archivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
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

CREATE TABLE TiposProfesores (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    especialidad VARCHAR(150),
    grado_academico VARCHAR(100),
    experiencia TEXT,
    foto VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ProfesorTipo (
    id SERIAL PRIMARY KEY,
    profesor_id INT REFERENCES Profesores(id) ON DELETE CASCADE,
    tipo_id INT REFERENCES TiposProfesores(id) ON DELETE CASCADE,
    UNIQUE (profesor_id, tipo_id)
);

CREATE TABLE Visita(
id SERIAL PRIMARY KEY,
    ip_address VARCHAR 255,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora TIME DEFAULT CURRENT_TIME
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

-- Función y trigger para la tabla Instalaciones
CREATE OR REPLACE FUNCTION log_modificacion_instalaciones()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Instalaciones', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Instalaciones', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Instalaciones', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_instalaciones
AFTER INSERT OR UPDATE OR DELETE ON Instalaciones
FOR EACH ROW EXECUTE FUNCTION log_modificacion_instalaciones();

-- Función y trigger para la tabla NivelesEstudios
CREATE OR REPLACE FUNCTION log_modificacion_nivelesestudios()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('NivelesEstudios', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('NivelesEstudios', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('NivelesEstudios', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nivelesestudios
AFTER INSERT OR UPDATE OR DELETE ON NivelesEstudios
FOR EACH ROW EXECUTE FUNCTION log_modificacion_nivelesestudios();

-- Función y trigger para la tabla CampoEstudio
CREATE OR REPLACE FUNCTION log_modificacion_campoestudio()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('CampoEstudio', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('CampoEstudio', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('CampoEstudio', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_campoestudio
AFTER INSERT OR UPDATE OR DELETE ON CampoEstudio
FOR EACH ROW EXECUTE FUNCTION log_modificacion_campoestudio();

-- Función y trigger para la tabla Imagenes
CREATE OR REPLACE FUNCTION log_modificacion_imagenes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Imagenes', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Imagenes', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Imagenes', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_imagenes
AFTER INSERT OR UPDATE OR DELETE ON Imagenes
FOR EACH ROW EXECUTE FUNCTION log_modificacion_imagenes();

-- Función y trigger para la tabla Noticia
CREATE OR REPLACE FUNCTION log_modificacion_noticia()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Noticia', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Noticia', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Noticia', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_noticia
AFTER INSERT OR UPDATE OR DELETE ON Noticia
FOR EACH ROW EXECUTE FUNCTION log_modificacion_noticia();

-- Función y trigger para la tabla Calendario
CREATE OR REPLACE FUNCTION log_modificacion_calendario()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Calendario', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Calendario', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Calendario', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendario
AFTER INSERT OR UPDATE OR DELETE ON Calendario
FOR EACH ROW EXECUTE FUNCTION log_modificacion_calendario();

-- Función y trigger para la tabla Taller
CREATE OR REPLACE FUNCTION log_modificacion_taller()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Taller', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Taller', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Taller', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_taller
AFTER INSERT OR UPDATE OR DELETE ON Taller
FOR EACH ROW EXECUTE FUNCTION log_modificacion_taller();

-- Función y trigger para la tabla Beca
CREATE OR REPLACE FUNCTION log_modificacion_beca()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Beca', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Beca', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Beca', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_beca
AFTER INSERT OR UPDATE OR DELETE ON Beca
FOR EACH ROW EXECUTE FUNCTION log_modificacion_beca();

-- Función y trigger para la tabla TiposProfesores
CREATE OR REPLACE FUNCTION log_modificacion_tiposprofesores()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('TiposProfesores', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('TiposProfesores', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('TiposProfesores', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tiposprofesores
AFTER INSERT OR UPDATE OR DELETE ON TiposProfesores
FOR EACH ROW EXECUTE FUNCTION log_modificacion_tiposprofesores();

-- Función y trigger para la tabla Profesores
CREATE OR REPLACE FUNCTION log_modificacion_profesores()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Profesores', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Profesores', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Profesores', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profesores
AFTER INSERT OR UPDATE OR DELETE ON Profesores
FOR EACH ROW EXECUTE FUNCTION log_modificacion_profesores();

-- Función y trigger para la tabla ProfesorTipo
CREATE OR REPLACE FUNCTION log_modificacion_profesortipo()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('ProfesorTipo', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('ProfesorTipo', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('ProfesorTipo', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profesortipo
AFTER INSERT OR UPDATE OR DELETE ON ProfesorTipo
FOR EACH ROW EXECUTE FUNCTION log_modificacion_profesortipo();

-- Función y trigger para la tabla Curso
CREATE OR REPLACE FUNCTION log_modificacion_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Curso', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Curso', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Curso', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_curso
AFTER INSERT OR UPDATE OR DELETE ON Curso
FOR EACH ROW EXECUTE FUNCTION log_modificacion_curso();

CREATE OR REPLACE FUNCTION log_modificacion_convocatoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Convocatoria', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Convocatoria', 'UPDATE', OLD.id, row_to_json(OLD)::jsonb);
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Historial (tabla, operacion, registro_id, datos_anteriores)
        VALUES ('Convocatoria', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_convocatoria
AFTER INSERT OR UPDATE OR DELETE ON Convocatoria
FOR EACH ROW EXECUTE FUNCTION log_modificacion_convocatoria();


-- Crear índices
CREATE INDEX idx_usuario_correo ON Usuario (correo);
CREATE INDEX idx_carrera_nombre ON Carrera (nombre_carrera);
CREATE INDEX idx_evento_fecha ON Evento (fecha_inicio);
CREATE INDEX idx_bolsadetrabajo_fecha_creacion ON BolsaDeTrabajo (fecha_creacion);
