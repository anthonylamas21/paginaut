<?php
class ProfesorTipo
{
  private $conn;
  private $table_name = "ProfesorTipo";

  public $id;
  public $profesor_id;
  public $tipo_id;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . " (profesor_id, tipo_id) VALUES (:profesor_id, :tipo_id)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":profesor_id", $this->profesor_id);
    $stmt->bindParam(":tipo_id", $this->tipo_id);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function getTipos()
  {
    $query = "SELECT tipo_id FROM " . $this->table_name . " WHERE profesor_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->profesor_id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  function delete()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE profesor_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->profesor_id);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }
}
