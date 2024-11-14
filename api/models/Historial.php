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
}
?>
