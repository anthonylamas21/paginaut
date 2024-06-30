<?php
class Direccion
{
  private $conn;
  private $table_name = "Direccion";

  public $id;
  public $abreviatura;
  public $nombre;
  public $activo;
  public $fecha_creacion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . " 
                    (abreviatura, nombre, activo)
                  VALUES
                    (:abreviatura, :nombre, :activo)";
    $stmt = $this->conn->prepare($query);

    $this->abreviatura = htmlspecialchars(strip_tags($this->abreviatura));
    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->activo = true; // Establecer $this->activo a true

    $stmt->bindParam(":abreviatura", $this->abreviatura);
    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function read()
  {
    $query = "SELECT
                    id, abreviatura, nombre, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
  }

  function readOne()
  {
    $query = "SELECT
                    id, abreviatura, nombre, activo, fecha_creacion
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
      $this->abreviatura = $row['abreviatura'];
      $this->nombre = $row['nombre'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      return true;
    }

    return false;
  }

  function update()
  {
    $query = "UPDATE " . $this->table_name . "
                  SET
                    abreviatura = :abreviatura,
                    nombre = :nombre,
                    activo = :activo
                  WHERE
                    id = :id";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $this->abreviatura = htmlspecialchars(strip_tags($this->abreviatura));
    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":abreviatura", $this->abreviatura);
    $stmt->bindParam(":nombre", $this->nombre);
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
