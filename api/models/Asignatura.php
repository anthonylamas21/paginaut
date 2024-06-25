<?php
class Asignatura {
    private $conn;
    private $table_name = "Asignatura";

    public $id;
    public $nombre;
    public $cuatrimestre_id;
    public $activo;
    public $fecha_creacion;

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
}
?>
