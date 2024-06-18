<?php
class Persona {
    private $conn;
    private $table_name = "Persona";

    public $id;
    public $nombre;
    public $primer_apellido;
    public $segundo_apellido;
    public $fecha_nacimiento;
    public $activo;
    public $fecha_creacion;
    public $fecha_actualizacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear persona
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, activo) VALUES (:nombre, :primer_apellido, :segundo_apellido, :fecha_nacimiento, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->primer_apellido = htmlspecialchars(strip_tags($this->primer_apellido));
        $this->segundo_apellido = htmlspecialchars(strip_tags($this->segundo_apellido));
        $this->fecha_nacimiento = htmlspecialchars(strip_tags($this->fecha_nacimiento));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":primer_apellido", $this->primer_apellido);
        $stmt->bindParam(":segundo_apellido", $this->segundo_apellido);
        $stmt->bindParam(":fecha_nacimiento", $this->fecha_nacimiento);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Leer todas las personas
    function read() {
        $query = "SELECT id, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, activo, fecha_creacion, fecha_actualizacion FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una persona por ID
    function readOne() {
        $query = "SELECT id, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, activo, fecha_creacion 
                  FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->nombre = $row['nombre'];
            $this->primer_apellido = $row['primer_apellido'];
            $this->segundo_apellido = $row['segundo_apellido'];
            $this->fecha_nacimiento = $row['fecha_nacimiento'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
        }
    }

    // Actualizar persona
    function update() {
        $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, primer_apellido = :primer_apellido, segundo_apellido = :segundo_apellido, fecha_nacimiento = :fecha_nacimiento, activo = :activo, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->primer_apellido = htmlspecialchars(strip_tags($this->primer_apellido));
        $this->segundo_apellido = htmlspecialchars(strip_tags($this->segundo_apellido));
        $this->fecha_nacimiento = htmlspecialchars(strip_tags($this->fecha_nacimiento));
        $this->activo = htmlspecialchars(strip_tags($this->activo));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":primer_apellido", $this->primer_apellido);
        $stmt->bindParam(":segundo_apellido", $this->segundo_apellido);
        $stmt->bindParam(":fecha_nacimiento", $this->fecha_nacimiento);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar persona
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