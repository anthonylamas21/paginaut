<?php
class HorariosBolsa
{
  private $conn;
  private $table_name = "HorariosBolsa";

  public $id;
  public $bolsa_id;
  public $dia;
  public $hora_inicio;
  public $hora_fin;
  public $cerrado;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  (bolsa_id, dia, hora_inicio, hora_fin, cerrado)
                  VALUES (:bolsa_id, :dia, :hora_inicio, :hora_fin, :cerrado)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":bolsa_id", $this->bolsa_id);
    $stmt->bindParam(":dia", $this->dia);
    $stmt->bindParam(":hora_inicio", $this->hora_inicio);
    $stmt->bindParam(":hora_fin", $this->hora_fin);
    $stmt->bindParam(":cerrado", $this->cerrado);

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
