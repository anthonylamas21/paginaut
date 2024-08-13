<?php
class BolsaDeTrabajo
{
  private $conn;
  private $table_name = "bolsadetrabajo";

  public $id;
  public $nombre_empresa;
  public $descripcion;
  public $archivo;
  public $activo;
  public $fecha_creacion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . " (nombre_empresa, descripcion, archivo, activo) VALUES (:nombre_empresa, :descripcion, :archivo, :activo)";
    $stmt = $this->conn->prepare($query);

    $this->nombre_empresa = htmlspecialchars(strip_tags($this->nombre_empresa));
    $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
    $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    $this->activo = true;

    $stmt->bindParam(":nombre_empresa", $this->nombre_empresa);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);

    return $stmt->execute();
  }

  function read()
  {
    $query = "SELECT id, nombre_empresa, descripcion, archivo, activo, fecha_creacion FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
  }

  function readOne()
  {
    $query = "SELECT id, nombre_empresa, descripcion, archivo, activo, fecha_creacion FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $this->nombre_empresa = $row['nombre_empresa'];
      $this->descripcion = $row['descripcion'];
      $this->archivo = $row['archivo'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
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

    $query = "UPDATE " . $this->table_name . " SET nombre_empresa = :nombre_empresa, descripcion = :descripcion, archivo = :archivo, activo = :activo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    $this->nombre_empresa = htmlspecialchars(strip_tags($this->nombre_empresa));
    $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
    $this->activo = htmlspecialchars(strip_tags($this->activo));

    if (empty($this->archivo)) {
      $this->archivo = $archivoActual;
    } else {
      $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    }

    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":nombre_empresa", $this->nombre_empresa);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);

    return $stmt->execute();
  }

  function updateStatus()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = :activo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

    return $stmt->execute();
  }

  function delete()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(1, $this->id);

    return $stmt->execute();
  }
}
