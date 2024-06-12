<?php
class Cuatrimestre {
    private $conn;
    private $table_name = "Cuatrimestre";

    public $id;
    public $numero;
    public $carrera_id;
    public $activo;
    public $fecha_creacion;

    // Propiedades adicionales para datos relacionados
    public $carrera_nombre;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear cuatrimestre
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (numero, carrera_id, activo) 
                 VALUES (:numero, :carrera_id, :activo)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->numero = htmlspecialchars(strip_tags($this->numero));
        $this->carrera_id = htmlspecialchars(strip_tags($this->carrera_id));
        $this->activo = isset($this->activo) ? $this->activo : true;

        // Vincular parámetros
        $stmt->bindParam(":numero", $this->numero, PDO::PARAM_INT);
        $stmt->bindParam(":carrera_id", $this->carrera_id, PDO::PARAM_INT);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todos los cuatrimestres
    function readAll() {
        $query = "SELECT c.id, c.numero, c.carrera_id, c.activo, c.fecha_creacion, 
                         car.nombre_carrera 
                  FROM " . $this->table_name . " c
                  INNER JOIN Carrera car ON c.carrera_id = car.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer un cuatrimestre por ID
    function readOne() {
        $query = "SELECT c.id, c.numero, c.carrera_id, c.activo, c.fecha_creacion, 
                         car.nombre_carrera 
                  FROM " . $this->table_name . " c
                  INNER JOIN Carrera car ON c.carrera_id = car.id
                  WHERE c.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->numero = $row['numero'];
            $this->carrera_id = $row['carrera_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->carrera_nombre = $row['nombre_carrera'];
            return true;
        }
        return false;
    }

    // Actualizar cuatrimestre
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                 numero = :numero, 
                 carrera_id = :carrera_id, 
                 activo = :activo
                 WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->numero = htmlspecialchars(strip_tags($this->numero));
        $this->carrera_id = htmlspecialchars(strip_tags($this->carrera_id));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular parámetros
        $stmt->bindParam(":numero", $this->numero, PDO::PARAM_INT);
        $stmt->bindParam(":carrera_id", $this->carrera_id, PDO::PARAM_INT);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar cuatrimestre
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>