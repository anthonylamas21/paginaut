<?php
class Profesor
{
  private $conn;
  private $table_name = "Profesores";

  public $id;
  public $nombre;
  public $apellido;
  public $correo;
  public $telefono;
  public $especialidad;
  public $grado_academico;
  public $experiencia;
  public $foto;
  public $activo;
  public $fecha_creacion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
            (nombre, apellido, correo, telefono, especialidad, grado_academico, experiencia, foto, activo)
            VALUES
            (:nombre, :apellido, :correo, :telefono, :especialidad, :grado_academico, :experiencia, :foto, :activo)";

    $stmt = $this->conn->prepare($query);
    $this->sanitize();

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":apellido", $this->apellido);
    $stmt->bindParam(":correo", $this->correo);
    $stmt->bindParam(":telefono", $this->telefono);
    $stmt->bindParam(":especialidad", $this->especialidad);
    $stmt->bindParam(":grado_academico", $this->grado_academico);
    $stmt->bindParam(":experiencia", $this->experiencia);
    $stmt->bindParam(":foto", $this->foto);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function read()
  {
    $query = "SELECT * FROM " . $this->table_name;
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  function readOne()
  {
    $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $this->nombre = $row['nombre'];
      $this->apellido = $row['apellido'];
      $this->correo = $row['correo'];
      $this->telefono = $row['telefono'];
      $this->especialidad = $row['especialidad'];
      $this->grado_academico = $row['grado_academico'];
      $this->experiencia = $row['experiencia'];
      $this->foto = $row['foto'];
      $this->activo = $row['activo'];
      return true;
    }

    return false;
  }

  function update()
  {
    $query = "UPDATE " . $this->table_name . " SET
            nombre = :nombre,
            apellido = :apellido,
            correo = :correo,
            telefono = :telefono,
            especialidad = :especialidad,
            grado_academico = :grado_academico,
            experiencia = :experiencia,
            foto = :foto,
            activo = :activo
            WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $this->sanitize();

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":apellido", $this->apellido);
    $stmt->bindParam(":correo", $this->correo);
    $stmt->bindParam(":telefono", $this->telefono);
    $stmt->bindParam(":especialidad", $this->especialidad);
    $stmt->bindParam(":grado_academico", $this->grado_academico);
    $stmt->bindParam(":experiencia", $this->experiencia);
    $stmt->bindParam(":foto", $this->foto);
    $stmt->bindParam(":activo", $this->activo);
    $stmt->bindParam(":id", $this->id);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function delete()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);

    if ($stmt->execute()) {
      return true;
    }

    return false;
  }

  function getDetalles()
  {
    return array(
      "id" => $this->id,
      "nombre" => $this->nombre,
      "apellido" => $this->apellido,
      "correo" => $this->correo,
      "telefono" => $this->telefono,
      "especialidad" => $this->especialidad,
      "grado_academico" => $this->grado_academico,
      "experiencia" => $this->experiencia,
      "foto" => $this->foto,
      "activo" => $this->activo,
      "fecha_creacion" => $this->fecha_creacion
    );
  }

  private function sanitize()
  {
    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->apellido = htmlspecialchars(strip_tags($this->apellido));
    $this->correo = htmlspecialchars(strip_tags($this->correo));
    $this->telefono = htmlspecialchars(strip_tags($this->telefono));
    $this->especialidad = htmlspecialchars(strip_tags($this->especialidad));
    $this->grado_academico = htmlspecialchars(strip_tags($this->grado_academico));
    $this->experiencia = htmlspecialchars(strip_tags($this->experiencia));
    $this->foto = htmlspecialchars(strip_tags($this->foto));
    $this->activo = htmlspecialchars(strip_tags($this->activo));
  }
}