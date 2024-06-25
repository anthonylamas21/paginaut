<?php
class ImagenEvento {
    private $conn;
    private $table_name = "ImagenEvento";

    public $id;
    public $evento_id;
    public $ruta_imagen;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear imagen de evento
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (evento_id, ruta_imagen) 
                 VALUES (:evento_id, :ruta_imagen)";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->evento_id = htmlspecialchars(strip_tags($this->evento_id));
        $this->ruta_imagen = htmlspecialchars(strip_tags($this->ruta_imagen));

        // Vincular parámetros
        $stmt->bindParam(":evento_id", $this->evento_id, PDO::PARAM_INT);
        $stmt->bindParam(":ruta_imagen", $this->ruta_imagen);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Leer todas las imágenes de eventos
    function readAll() {
        $query = "SELECT id, evento_id, ruta_imagen FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una imagen de evento por ID
    function readOne() {
        $query = "SELECT id, evento_id, ruta_imagen FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->evento_id = $row['evento_id'];
            $this->ruta_imagen = $row['ruta_imagen'];
            return true;
        }
        return false;
    }

    // Actualizar imagen de evento
    function update() {
        $query = "UPDATE " . $this->table_name . " SET evento_id = :evento_id, ruta_imagen = :ruta_imagen WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->evento_id = htmlspecialchars(strip_tags($this->evento_id));
        $this->ruta_imagen = htmlspecialchars(strip_tags($this->ruta_imagen));

        // Vincular parámetros
        $stmt->bindParam(":evento_id", $this->evento_id, PDO::PARAM_INT);
        $stmt->bindParam(":ruta_imagen", $this->ruta_imagen);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar imagen de evento
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
