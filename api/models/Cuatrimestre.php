<?php
class Cuatrimestre {
  private $conn;
  private $table_name = "Cuatrimestre";

  public $id;
  public $numero;
  public $carrera_id;
  public $activo;
  public $fecha_creacion;

  public function __construct($db) {
      $this->conn = $db;
  }

  public function readByCarrera() {
      $query = "SELECT * FROM " . $this->table_name . " WHERE carrera_id = :carrera_id AND activo = TRUE";
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':carrera_id', $this->carrera_id, PDO::PARAM_INT);
      $stmt->execute();
      return $stmt;
  }

  public function create() {
    $query = "INSERT INTO " . $this->table_name . " (numero, carrera_id, activo) VALUES (:numero, :carrera_id, :activo)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(':numero', $this->numero, PDO::PARAM_INT);
    $stmt->bindParam(':carrera_id', $this->carrera_id, PDO::PARAM_INT);
    $stmt->bindParam(':activo', $this->activo, PDO::PARAM_BOOL);

    if ($stmt->execute()) {
        // Obtener el ID basado en el número y carrera_id
        $query = "SELECT id FROM " . $this->table_name . " WHERE numero = :numero AND carrera_id = :carrera_id ORDER BY fecha_creacion DESC LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':numero', $this->numero, PDO::PARAM_INT);
        $stmt->bindParam(':carrera_id', $this->carrera_id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->id = $row['id'];
            return true;
        }
    }
    return false;
}



public function readOne() {
  $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
  $stmt = $this->conn->prepare($query);

  $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
  $stmt->execute();

  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($row) {
      $this->numero = $row['numero'];
      $this->carrera_id = $row['carrera_id'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      return true;
  }

  return false;
}


public function getCuatrimestresYAsignaturas($carreraId) {
  $queryCuatrimestres = "SELECT * FROM Cuatrimestre WHERE carrera_id = :carrera_id AND activo = TRUE";
  $stmtCuatrimestres = $this->conn->prepare($queryCuatrimestres);
  $stmtCuatrimestres->bindParam(':carrera_id', $carreraId, PDO::PARAM_INT);
  $stmtCuatrimestres->execute();
  $cuatrimestres = $stmtCuatrimestres->fetchAll(PDO::FETCH_ASSOC);

  $result = [];

  foreach ($cuatrimestres as $cuatrimestre) {
      $cuatrimestreId = $cuatrimestre['id'];

      $queryAsignaturas = "SELECT * FROM Asignatura WHERE cuatrimestre_id = :cuatrimestre_id AND activo = TRUE";
      $stmtAsignaturas = $this->conn->prepare($queryAsignaturas);
      $stmtAsignaturas->bindParam(':cuatrimestre_id', $cuatrimestreId, PDO::PARAM_INT);
      $stmtAsignaturas->execute();
      $asignaturas = $stmtAsignaturas->fetchAll(PDO::FETCH_ASSOC);

      $cuatrimestre['asignaturas'] = $asignaturas;
      $result[] = $cuatrimestre;
  }

  return $result;
}

}
