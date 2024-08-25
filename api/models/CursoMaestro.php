<?php
class CursoMaestro {
    private $conn;
    private $table_name = "curso_maestro";

    public $id;
    public $curso_id;
    public $profesor_id;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (curso_id, profesor_id, activo) 
                  VALUES (:curso_id, :profesor_id, :activo)";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(":curso_id", $this->curso_id);
        $stmt->bindParam(":profesor_id", $this->profesor_id);
        $stmt->bindParam(":activo", $this->activo);
    
        return $stmt->execute();
    }
    

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE curso_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->curso_id);
        return $stmt->execute();
    }

    public function obtenerProfesoresPorCurso() {
        $query = "SELECT profesor_id FROM " . $this->table_name . " WHERE curso_id = :curso_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':curso_id', $this->curso_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}
