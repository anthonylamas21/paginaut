<?php
class Calendario {
    private $conn;
    private $table_name = "Calendario";

    public $id;
    public $titulo;
    public $archivo_id;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                    (titulo, archivo_id, activo)
                  VALUES
                    (:titulo, :archivo_id, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->archivo_id = htmlspecialchars(strip_tags($this->archivo_id));
        $this->activo = true; // Establecer $this->activo a true

        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":archivo_id", $this->archivo_id);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function read() {
        $query = "SELECT
                    id, titulo, archivo_id, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne() {
        $query = "SELECT
                    id, titulo, archivo_id, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  WHERE
                    id = ?
                  LIMIT
                    0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->titulo = $row['titulo'];
            $this->archivo_id = $row['archivo_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }

        return false;
    }

    function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    titulo = :titulo,
                    archivo_id = :archivo_id,
                    activo = :activo
                  WHERE
                    id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->archivo_id = htmlspecialchars(strip_tags($this->archivo_id));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":archivo_id", $this->archivo_id);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>