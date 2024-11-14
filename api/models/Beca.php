<?php
class Beca
{
  private $conn;
  private $table_name = "beca";

  public $id;
  public $nombre;
  public $descripcion;
  public $archivo;
  public $activo;
  public $fecha_creacion;
  public $tipo; // Nuevo campo

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . " (nombre, descripcion, archivo, activo, tipo) VALUES (:nombre, :descripcion, :archivo, :activo, :tipo)";
    $stmt = $this->conn->prepare($query);

    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
    $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    $this->activo = true;
    $this->tipo = htmlspecialchars(strip_tags($this->tipo)); // Nuevo campo

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);
    $stmt->bindParam(":tipo", $this->tipo); // Nuevo campo

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function read()
  {
    $query = "SELECT id, nombre, descripcion, archivo, activo, fecha_creacion, tipo FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
  }

  function readOne()
  {
    $query = "SELECT id, nombre, descripcion, archivo, activo, fecha_creacion, tipo
              FROM " . $this->table_name . "
              WHERE id = ?
              LIMIT 1";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $this->nombre = $row['nombre'];
      $this->descripcion = $row['descripcion'];
      $this->archivo = $row['archivo'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      $this->tipo = $row['tipo']; // Nuevo campo
      return true;
    }

    return false;
  }

  function update()
  {
    $query = "SELECT archivo FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $archivoActual = $row['archivo'];

    $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, descripcion = :descripcion, archivo = :archivo, activo = :activo, tipo = :tipo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
    $this->activo = htmlspecialchars(strip_tags($this->activo));
    $this->tipo = htmlspecialchars(strip_tags($this->tipo)); // Nuevo campo

    if (empty($this->archivo)) {
      $this->archivo = $archivoActual;
    } else {
      $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    }

    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);
    $stmt->bindParam(":tipo", $this->tipo); // Nuevo campo

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
