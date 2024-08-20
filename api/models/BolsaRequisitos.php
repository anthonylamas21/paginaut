<?php
class BolsaRequisitos
{
  private $conn;
  private $table_name = "Requisitos";

  public $id;
  public $id_bolsadetrabajo;
  public $requisito;
  public $detalles;

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

  function getDetalles(){
    $query = "SELECT id_bolsadetrabajo, requisito FROM ". $this->table_name. " WHERE id_bolsadetrabajo = :id_bolsadetrabajo";
    $stmt = $this->conn->prepare($query);

    // Sanitizar y verificar que id_bolsadetrabajo es un entero
    $this->id_bolsadetrabajo = htmlspecialchars(strip_tags($this->id_bolsadetrabajo));

    if (!is_numeric($this->id_bolsadetrabajo) || intval($this->id_bolsadetrabajo) <= 0) {
        return false; // Retornar falso si id_bolsadetrabajo no es un número válido
    }

    // Enlazar el parámetro id_bolsadetrabajo
    $stmt->bindParam(":id_bolsadetrabajo", $this->id_bolsadetrabajo, PDO::PARAM_INT);

    // Ejecutar la consulta
    $stmt->execute();

    // Obtener todas las filas
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if($rows) {
        // Asignar valores a las propiedades del objeto
        $this->detalles = $rows;
        return true;
    } else {
        return false;
    }
}


}
