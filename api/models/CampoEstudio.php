<?php
class CampoEstudio
{
    private $conn;
    private $table_name = "CampoEstudio";

    public $id;
    public $campo;
    public $activo;
    public $fecha_creacion;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . " (campo, activo) VALUES (:campo, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->campo = htmlspecialchars(strip_tags($this->campo));
        $this->activo = true;

        $stmt->bindParam(":campo", $this->campo);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    function read()
    {
        $query = "SELECT id, campo, activo, fecha_creacion FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne()
    {
        $query = "SELECT id, campo, activo, fecha_creacion FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->campo = $row['campo'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE " . $this->table_name . " SET campo = :campo, activo = :activo WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->campo = htmlspecialchars(strip_tags($this->campo));
        $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":campo", $this->campo);
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
