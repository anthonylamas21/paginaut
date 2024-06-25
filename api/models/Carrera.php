<?php
class Carrera {
    private $conn;
    private $table_name = "Carrera";

    public $id;
    public $nombre_carrera;
    public $perfil_profesional;
    public $ocupacion_profesional;
    public $imagen_carrera;
    public $direccion_id;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear carrera
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre_carrera, perfil_profesional, ocupacion_profesional, imagen_carrera, direccion_id, activo) 
                 VALUES (:nombre_carrera, :perfil_profesional, :ocupacion_profesional, :imagen_carrera, :direccion_id, :activo)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
        $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
        $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
        $this->imagen_carrera = htmlspecialchars(strip_tags($this->imagen_carrera));
        $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
        $this->activo = isset($this->activo) ? $this->activo : true;

        // Vincular parámetros
        $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
        $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
        $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
        $stmt->bindParam(":imagen_carrera", $this->imagen_carrera);
        $stmt->bindParam(":direccion_id", $this->direccion_id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todas las carreras
    function readAll() {
        $query = "SELECT c.id, c.nombre_carrera, c.perfil_profesional, c.ocupacion_profesional, 
                         c.imagen_carrera, c.direccion_id, c.activo, c.fecha_creacion, 
                         d.nombre AS nombre_direccion
                  FROM " . $this->table_name . " c
                  LEFT JOIN Direccion d ON c.direccion_id = d.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una carrera por ID
    function readOne() {
        $query = "SELECT c.id, c.nombre_carrera, c.perfil_profesional, c.ocupacion_profesional, 
                         c.imagen_carrera, c.direccion_id, c.activo, c.fecha_creacion, 
                         d.nombre AS nombre_direccion
                  FROM " . $this->table_name . " c
                  LEFT JOIN Direccion d ON c.direccion_id = d.id
                  WHERE c.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->nombre_carrera = $row['nombre_carrera'];
            $this->perfil_profesional = $row['perfil_profesional'];
            $this->ocupacion_profesional = $row['ocupacion_profesional'];
            $this->imagen_carrera = $row['imagen_carrera'];
            $this->direccion_id = $row['direccion_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }
        return false;
    }

    // Actualizar carrera
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                 nombre_carrera = :nombre_carrera, 
                 perfil_profesional = :perfil_profesional,
                 ocupacion_profesional = :ocupacion_profesional, 
                 imagen_carrera = :imagen_carrera, 
                 direccion_id = :direccion_id, 
                 activo = :activo
                 WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
        $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
        $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
        $this->imagen_carrera = htmlspecialchars(strip_tags($this->imagen_carrera));
        $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular parámetros
        $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
        $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
        $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
        $stmt->bindParam(":imagen_carrera", $this->imagen_carrera);
        $stmt->bindParam(":direccion_id", $this->direccion_id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar carrera
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