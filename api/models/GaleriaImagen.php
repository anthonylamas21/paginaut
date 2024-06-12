<?php
class GaleriaImagen {
    private $conn;
    private $table_name = "GaleriaImagen";

    public $id;
    public $tipo;
    public $asociado_id;
    public $ruta_imagen;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear una nueva imagen en la galería
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (tipo, asociado_id, ruta_imagen) 
                 VALUES (:tipo, :asociado_id, :ruta_imagen)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->asociado_id = htmlspecialchars(strip_tags($this->asociado_id));
        $this->ruta_imagen = htmlspecialchars(strip_tags($this->ruta_imagen));

        // Vincular parámetros
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":asociado_id", $this->asociado_id);
        $stmt->bindParam(":ruta_imagen", $this->ruta_imagen);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todas las imágenes de la galería
    function readAll() {
        $query = "SELECT id, tipo, asociado_id, ruta_imagen, fecha_creacion 
                  FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una imagen de la galería por ID
    function readOne() {
        $query = "SELECT id, tipo, asociado_id, ruta_imagen, fecha_creacion 
                  FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->tipo = $row['tipo'];
            $this->asociado_id = $row['asociado_id'];
            $this->ruta_imagen = $row['ruta_imagen'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }
        return false;
    }

    // Actualizar una imagen de la galería
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                 tipo = :tipo, 
                 asociado_id = :asociado_id, 
                 ruta_imagen = :ruta_imagen 
                 WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->asociado_id = htmlspecialchars(strip_tags($this->asociado_id));
        $this->ruta_imagen = htmlspecialchars(strip_tags($this->ruta_imagen));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular parámetros
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":asociado_id", $this->asociado_id);
        $stmt->bindParam(":ruta_imagen", $this->ruta_imagen);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar una imagen de la galería
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
