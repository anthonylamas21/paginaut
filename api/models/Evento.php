<?php
class Evento {
    private $conn;
    private $table_name = "Evento";

    public $id;
    public $titulo;
    public $informacion_evento;
    public $tipo;
    public $imagen_evento;
    public $lugar_evento;
    public $fecha_inicio;
    public $fecha_fin;
    public $hora_inicio;
    public $hora_fin;
    public $activo;
    public $fecha_creacion;
    public $archivo_asociado;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                    (titulo, informacion_evento, tipo, lugar_evento, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo)
                  VALUES
                    (:titulo, :informacion_evento, :tipo, :lugar_evento, :fecha_inicio, :fecha_fin, :hora_inicio, :hora_fin, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->lugar_evento = htmlspecialchars(strip_tags($this->lugar_evento));
        $this->activo = true;

        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":lugar_evento", $this->lugar_evento);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            if (!empty($this->imagen_evento)) {
                $this->saveImagenEvento();
            }
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoEvento();
            }
            return true;
        }

        return false;
    }

    function read() {
        $query = "SELECT
                    id, titulo, informacion_evento, tipo, lugar_evento, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne() {
        $query = "SELECT
                    id, titulo, informacion_evento, tipo, lugar_evento, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  WHERE
                    id = ?
                  LIMIT
                    0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->titulo = $row['titulo'];
            $this->informacion_evento = $row['informacion_evento'];
            $this->tipo = $row['tipo'];
            $this->imagen_evento = $this->getImagenEvento();
            $this->lugar_evento = $row['lugar_evento'];
            $this->fecha_inicio = $row['fecha_inicio'];
            $this->fecha_fin = $row['fecha_fin'];
            $this->hora_inicio = $row['hora_inicio'];
            $this->hora_fin = $row['hora_fin'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->archivo_asociado = $this->getArchivoEvento();
            return true;
        }

        return false;
    }

    function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    titulo = :titulo,
                    informacion_evento = :informacion_evento,
                    tipo = :tipo,
                    lugar_evento = :lugar_evento,
                    fecha_inicio = :fecha_inicio,
                    fecha_fin = :fecha_fin,
                    hora_inicio = :hora_inicio,
                    hora_fin = :hora_fin,
                    activo = :activo
                  WHERE
                    id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->lugar_evento = htmlspecialchars(strip_tags($this->lugar_evento));
        $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":lugar_evento", $this->lugar_evento);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            if (!empty($this->imagen_evento)) {
                $this->saveImagenEvento();
            }
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoEvento();
            }
            return true;
        }

        return false;
    }

    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            $this->deleteImagenEvento();
            $this->deleteArchivoEvento();
            return true;
        }

        return false;
    }

    private function saveImagenEvento() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Evento', :asociado_id, TRUE)
                  ON CONFLICT (seccion, asociado_id) DO UPDATE
                  SET ruta_imagen = EXCLUDED.ruta_imagen";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->titulo;
        $descripcion = $this->informacion_evento;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen_evento));
        $asociado_id = $this->id;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    public function getImagenEvento() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }

    private function deleteImagenEvento() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }

    private function saveArchivoEvento() {
        $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id)
                  VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Evento', :asociado_id)
                  ON CONFLICT (seccion, asociado_id) DO UPDATE
                  SET nombre_archivo = EXCLUDED.nombre_archivo, ruta_archivo = EXCLUDED.ruta_archivo, tipo_archivo = EXCLUDED.tipo_archivo";
        $stmt = $this->conn->prepare($query);

        $nombre_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['nombre_archivo']));
        $ruta_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['ruta_archivo']));
        $tipo_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['tipo_archivo']));
        $asociado_id = $this->id;

        $stmt->bindParam(":nombre_archivo", $nombre_archivo);
        $stmt->bindParam(":ruta_archivo", $ruta_archivo);
        $stmt->bindParam(":tipo_archivo", $tipo_archivo);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    public function getArchivoEvento() {
        $query = "SELECT nombre_archivo, ruta_archivo, tipo_archivo FROM Archivos WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row : null;
    }

    private function deleteArchivoEvento() {
        $query = "DELETE FROM Archivos WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
}
?>
