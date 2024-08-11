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

    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE activo = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre, cuatrimestre_id, activo) VALUES (:nombre, :cuatrimestre_id, :activo)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre, PDO::PARAM_STR);
        $stmt->bindParam(':cuatrimestre_id', $this->cuatrimestre_id, PDO::PARAM_INT);
        $stmt->bindParam(':activo', $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
