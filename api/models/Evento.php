<?php
class Evento {
    private $conn;
    private $table_name = "Evento";

    public $id;
    public $informacion_evento;
    public $activo;
    public $fecha_inicio;
    public $fecha_fin;
    public $hora_inicio;
    public $hora_fin;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear evento
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (informacion_evento, activo, fecha_inicio, fecha_fin, hora_inicio, hora_fin) 
                 VALUES (:informacion_evento, :activo, :fecha_inicio, :fecha_fin, :hora_inicio, :hora_fin)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));

        // Vincular parámetros
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todos los eventos
    function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer un evento por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->informacion_evento = $row['informacion_evento'];
            $this->activo = $row['activo'];
            $this->fecha_inicio = $row['fecha_inicio'];
            $this->fecha_fin = $row['fecha_fin'];
            $this->hora_inicio = $row['hora_inicio'];
            $this->hora_fin = $row['hora_fin'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }
        return false;
    }

    // Actualizar evento
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                 informacion_evento = :informacion_evento, 
                 activo = :activo, 
                 fecha_inicio = :fecha_inicio, 
                 fecha_fin = :fecha_fin, 
                 hora_inicio = :hora_inicio, 
                 hora_fin = :hora_fin
                 WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular parámetros
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar evento
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
