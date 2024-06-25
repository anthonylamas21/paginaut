<?php
class Direccion {
    private $conn;
    private $table_name = "Direccion";

    public $id;
    public $nombre;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear una nueva dirección
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre, activo) VALUES (:nombre, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":activo", $this->activo);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Leer todas las direcciones
    function read() {
        $query = "SELECT id, nombre, activo, fecha_creacion FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar una dirección
    function update() {
        $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, activo = :activo WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->activo = htmlspecialchars(strip_tags($this->activo));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar una dirección
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
