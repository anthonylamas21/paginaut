<?php
class Historial {
    private $conn;
    private $table_name = "Historial";

    public $id;
    public $tabla;
    public $operacion;
    public $registro_id;
    public $datos_anteriores;
    public $fecha;
    public $hora;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear registro de historial
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET tabla = :tabla, operacion = :operacion, registro_id = :registro_id, 
                      datos_anteriores = :datos_anteriores, hora = :hora";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->tabla = htmlspecialchars(strip_tags($this->tabla));
        $this->operacion = htmlspecialchars(strip_tags($this->operacion));
        $this->registro_id = htmlspecialchars(strip_tags($this->registro_id));
        $this->datos_anteriores = json_encode($this->datos_anteriores);
        $this->hora = htmlspecialchars(strip_tags($this->hora));

        // Vincular parámetros
        $stmt->bindParam(":tabla", $this->tabla);
        $stmt->bindParam(":operacion", $this->operacion);
        $stmt->bindParam(":registro_id", $this->registro_id);
        $stmt->bindParam(":datos_anteriores", $this->datos_anteriores);
        $stmt->bindParam(":hora", $this->hora);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todos los registros de historial
    function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha DESC, hora DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer un registro de historial por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->tabla = $row['tabla'];
            $this->operacion = $row['operacion'];
            $this->registro_id = $row['registro_id'];
            $this->datos_anteriores = $row['datos_anteriores'];
            $this->fecha = $row['fecha'];
            $this->hora = $row['hora'];
            return true;
        }
        return false;
    }

    // Actualizar registro de historial
    function update() {
        // La actualización no es necesaria para los registros de historial
        return false;
    }

    // Eliminar registro de historial
    function delete() {
        // La eliminación no es necesaria para los registros de historial
        return false;
    }
}
?>
