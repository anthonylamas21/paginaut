<?php
class RequisitosBolsa
{
  private $conn;
  private $table_name = "RequisitosBolsa";

  public $id;
  public $bolsa_id;
  public $descripcion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  (bolsa_id, descripcion)
                  VALUES (:bolsa_id, :descripcion)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":bolsa_id", $this->bolsa_id);
    $stmt->bindParam(":descripcion", $this->descripcion);

    return $stmt->execute();
  }

  function read()
  {
    $query = "SELECT * FROM " . $this->table_name . " WHERE bolsa_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->bolsa_id);
    $stmt->execute();
    return $stmt;
  }

  function deleteByBolsaId()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE bolsa_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->bolsa_id);
    return $stmt->execute();
  }
}
