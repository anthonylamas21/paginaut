<?php
class Calendario
{
  private $conn;
  private $table_name = "Calendario";

  public $id;
  public $titulo;
  public $archivo;
  public $activo;
  public $fecha_creacion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . " (titulo, archivo, activo) VALUES (:titulo, :archivo, :activo)";
    $stmt = $this->conn->prepare($query);

    $this->titulo = htmlspecialchars(strip_tags($this->titulo));
    $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    $this->activo = true;

    $stmt->bindParam(":titulo", $this->titulo);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function read()
  {
    $query = "SELECT id, titulo, archivo, activo, fecha_creacion FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
  }

  function readOne()
  {
    $query = "SELECT id, titulo, archivo, activo, fecha_creacion FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $this->titulo = $row['titulo'];
      $this->archivo = $row['archivo'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      return true;
    }

    return false;
  }

  function update()
  {
    // Primero, obtener el registro actual
    $query = "SELECT archivo FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $archivoActual = $row['archivo'];

    // Ahora, actualizar el registro
    $query = "UPDATE " . $this->table_name . " SET titulo = :titulo, archivo = :archivo, activo = :activo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $this->titulo = htmlspecialchars(strip_tags($this->titulo));
    $this->activo = htmlspecialchars(strip_tags($this->activo));

    // Si no se proporciona un nuevo archivo, mantener el archivo actual
    if (empty($this->archivo)) {
      $this->archivo = $archivoActual;
    } else {
      $this->archivo = htmlspecialchars(strip_tags($this->archivo));
    }

    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":titulo", $this->titulo);
    $stmt->bindParam(":archivo", $this->archivo);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function updateStatus()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = :activo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    // Bind params
    $stmt->bindParam(':activo', $this->activo, PDO::PARAM_BOOL);
    $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

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
