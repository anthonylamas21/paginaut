<?php
class BolsaDeTrabajo
{
  private $conn;
  private $table_name = "BolsaDeTrabajo";

  public $id;
  public $nombre_empresa;
  public $descripcion_trabajo;
  public $puesto_trabajo;
  public $direccion;
  public $telefono;
  public $correo;
  public $activo;
  public $fecha_creacion;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  (nombre_empresa, descripcion_trabajo, puesto_trabajo, direccion, telefono, correo, activo)
                  VALUES
                  (:nombre_empresa, :descripcion_trabajo, :puesto_trabajo, :direccion, :telefono, :correo, :activo)";

    $stmt = $this->conn->prepare($query);

    $this->nombre_empresa = htmlspecialchars(strip_tags($this->nombre_empresa));
    $this->descripcion_trabajo = htmlspecialchars(strip_tags($this->descripcion_trabajo));
    $this->puesto_trabajo = htmlspecialchars(strip_tags($this->puesto_trabajo));
    $this->direccion = htmlspecialchars(strip_tags($this->direccion));
    $this->telefono = htmlspecialchars(strip_tags($this->telefono));
    $this->correo = htmlspecialchars(strip_tags($this->correo));
    $this->activo = $this->activo ? 1 : 0;

    $stmt->bindParam(":nombre_empresa", $this->nombre_empresa);
    $stmt->bindParam(":descripcion_trabajo", $this->descripcion_trabajo);
    $stmt->bindParam(":puesto_trabajo", $this->puesto_trabajo);
    $stmt->bindParam(":direccion", $this->direccion);
    $stmt->bindParam(":telefono", $this->telefono);
    $stmt->bindParam(":correo", $this->correo);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      $this->id = $this->conn->lastInsertId();
      return true;
    }

    return false;
  }

  function read()
  {
    $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
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
      $this->nombre_empresa = $row['nombre_empresa'];
      $this->descripcion_trabajo = $row['descripcion_trabajo'];
      $this->puesto_trabajo = $row['puesto_trabajo'];
      $this->direccion = $row['direccion'];
      $this->telefono = $row['telefono'];
      $this->correo = $row['correo'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      return true;
    }
    return false;
  }

  function update()
  {
    $query = "UPDATE " . $this->table_name . " SET
                  nombre_empresa = :nombre_empresa,
                  descripcion_trabajo = :descripcion_trabajo,
                  puesto_trabajo = :puesto_trabajo,
                  direccion = :direccion,
                  telefono = :telefono,
                  correo = :correo,
                  activo = :activo
                  WHERE id = :id";

    $stmt = $this->conn->prepare($query);

    $this->nombre_empresa = htmlspecialchars(strip_tags($this->nombre_empresa));
    $this->descripcion_trabajo = htmlspecialchars(strip_tags($this->descripcion_trabajo));
    $this->puesto_trabajo = htmlspecialchars(strip_tags($this->puesto_trabajo));
    $this->direccion = htmlspecialchars(strip_tags($this->direccion));
    $this->telefono = htmlspecialchars(strip_tags($this->telefono));
    $this->correo = htmlspecialchars(strip_tags($this->correo));
    $this->activo = $this->activo ? 1 : 0;

    $stmt->bindParam(":nombre_empresa", $this->nombre_empresa);
    $stmt->bindParam(":descripcion_trabajo", $this->descripcion_trabajo);
    $stmt->bindParam(":puesto_trabajo", $this->puesto_trabajo);
    $stmt->bindParam(":direccion", $this->direccion);
    $stmt->bindParam(":telefono", $this->telefono);
    $stmt->bindParam(":correo", $this->correo);
    $stmt->bindParam(":activo", $this->activo);
    $stmt->bindParam(":id", $this->id);

    return $stmt->execute();
  }

  function delete()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);

    return $stmt->execute();
  }

  function saveRequisitos($requisitos)
  {
    try {
      $query = "INSERT INTO Requisitos (id_bolsadetrabajo, requisito) VALUES (:id_bolsadetrabajo, :requisito)";
      $stmt = $this->conn->prepare($query);

      foreach ($requisitos as $requisito) {
        $requisito = htmlspecialchars(strip_tags($requisito));
        $stmt->bindParam(":id_bolsadetrabajo", $this->id);
        $stmt->bindParam(":requisito", $requisito);
        if (!$stmt->execute()) {
          throw new Exception("Error al guardar requisito.");
        }
      }
      return true;
    } catch (Exception $e) {
      throw new Exception("Error al guardar requisitos: " . $e->getMessage());
    }
  }

  function getRequisitos()
  {
    $query = "SELECT requisito FROM Requisitos WHERE id_bolsadetrabajo = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  function updateRequisitos($requisitos)
  {
    $this->deleteRequisitos();
    return $this->saveRequisitos($requisitos);
  }

  function deleteRequisitos()
  {
    $query = "DELETE FROM Requisitos WHERE id_bolsadetrabajo = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
  }

  function readactive()
{
    $query = "SELECT * FROM " . $this->table_name . " WHERE activo = true ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


  function getDetalles()
  {
    return array(
      "id" => $this->id,
      "nombre_empresa" => $this->nombre_empresa,
      "descripcion_trabajo" => $this->descripcion_trabajo,
      "puesto_trabajo" => $this->puesto_trabajo,
      "direccion" => $this->direccion,
      "telefono" => $this->telefono,
      "correo" => $this->correo,
      "activo" => $this->activo,
      "fecha_creacion" => $this->fecha_creacion,
      "requisitos" => $this->getRequisitos()
    );
  }
}
