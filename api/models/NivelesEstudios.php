<?php
class NivelesEstudios
{
    private $conn;
    private $table_name = "NivelesEstudios";

    public $id;
    public $nivel;
    public $activo;
    public $fecha_creacion;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . " (nivel, activo) VALUES (:nivel, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->nivel = htmlspecialchars(strip_tags($this->nivel));
        $this->activo = true;

        $stmt->bindParam(":nivel", $this->nivel);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    function read()
    {
        $query = "SELECT id, nivel, activo, fecha_creacion FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne()
    {
        $query = "SELECT id, nivel, activo, fecha_creacion FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->nivel = $row['nivel'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE " . $this->table_name . " SET nivel = :nivel, activo = :activo WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nivel = htmlspecialchars(strip_tags($this->nivel));
        $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nivel", $this->nivel);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function updateStatus()
    {
        $query = "UPDATE " . $this->table_name . " SET activo = :activo WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete()
    {
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
