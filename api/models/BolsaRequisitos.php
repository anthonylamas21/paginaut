<?php
class BolsaRequisitos
{
  private $conn;
  private $table_name = "Requisitos";

  public $id;
  public $id_bolsadetrabajo;
  public $requisito;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  (id_bolsadetrabajo, requisito)
                  VALUES
                  (:id_bolsadetrabajo, :requisito)";

    $stmt = $this->conn->prepare($query);

    $this->id_bolsadetrabajo = htmlspecialchars(strip_tags($this->id_bolsadetrabajo));
    $this->requisito = htmlspecialchars(strip_tags($this->requisito));

    $stmt->bindParam(":id_bolsadetrabajo", $this->id_bolsadetrabajo);
    $stmt->bindParam(":requisito", $this->requisito);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

}
