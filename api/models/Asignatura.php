<?php
class Asignatura {
    private $conn;
    private $table_name = "Asignatura";

    public $id;
    public $nombre;
    public $cuatrimestre_id;
    public $activo;
    public $fecha_creacion;
    public $archivo_asociado;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear asignatura
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre, cuatrimestre_id, activo) 
                 VALUES (:nombre, :cuatrimestre_id, :activo)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->cuatrimestre_id = htmlspecialchars(strip_tags($this->cuatrimestre_id));
        $this->activo = isset($this->activo) ? $this->activo : true;

        // Vincular parámetros
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":cuatrimestre_id", $this->cuatrimestre_id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoAsignatura();
            }
            return true;
        }
        return false;
    }

    // Leer todas las asignaturas
    function readAll() {
        $query = "SELECT id, nombre, cuatrimestre_id, activo, fecha_creacion 
                  FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una asignatura por ID
    function readOne() {
        $query = "SELECT id, nombre, cuatrimestre_id, activo, fecha_creacion 
                  FROM " . $this->table_name . " 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->nombre = $row['nombre'];
            $this->cuatrimestre_id = $row['cuatrimestre_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->archivo_asociado = $this->getArchivoAsignatura();
            return true;
        }
        return false;
    }

    // Actualizar asignatura
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                 nombre = :nombre, 
                 cuatrimestre_id = :cuatrimestre_id, 
                 activo = :activo
                 WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->cuatrimestre_id = htmlspecialchars(strip_tags($this->cuatrimestre_id));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular parámetros
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":cuatrimestre_id", $this->cuatrimestre_id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoAsignatura();
            }
            return true;
        }
        return false;
    }

    // Eliminar asignatura
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Guardar archivo asociado a la asignatura
    private function saveArchivoAsignatura() {
        $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id)
                  VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Asignatura', :asociado_id)
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

    // Obtener archivo asociado a la asignatura
    public function getArchivoAsignatura() {
        $query = "SELECT nombre_archivo, ruta_archivo, tipo_archivo FROM Archivos WHERE seccion = 'Asignatura' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row : null;
    }
}
?>
