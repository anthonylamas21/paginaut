<?php
class Curso
{
  private $conn;
  private $table_name = "Curso";

  public $id;
  public $nombre;
  public $descripcion;
  public $activo;
  public $fecha_creacion;
  public $imagen_principal;
  public $imagenes_generales;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  function create()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  (nombre, descripcion, activo)
                  VALUES
                  (:nombre, :descripcion, :activo)";

    $stmt = $this->conn->prepare($query);

    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->activo = $this->activo ? 1 : 0;
    $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
      $this->id = $this->conn->lastInsertId();
      $this->saveImagenPrincipal();
      return true;
    }
    return false;
  }

  private function saveImagenPrincipal()
  {
    $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Cursos', :asociado_id, TRUE)";
    $stmt = $this->conn->prepare($query);

    $titulo = $this->nombre;
    $descripcion = "Galeria imagen";
    $ruta_imagen = htmlspecialchars(strip_tags($this->imagen_principal));
    $asociado_id = $this->id;

    $stmt->bindParam(":titulo", $titulo);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":ruta_imagen", $ruta_imagen);
    $stmt->bindParam(":asociado_id", $asociado_id);

    $stmt->execute();
  }

  public function getImagenesGenerales()
  {
    $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Cursos' AND asociado_id = :asociado_id AND principal = FALSE";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
    $imagenes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $imagenes[] = $row['ruta_imagen'];
    }
    return $imagenes;
  }

  function read()
  {
    $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    $cursos_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $this->id = $row['id'];
      $row['imagen_principal'] = $this->getImagenPrincipal();
      $row['imagenes_generales'] = $this->getImagenesGenerales();
      array_push($cursos_arr, $row);
    }

    return $cursos_arr;
  }

  function readOne()
  {
    $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $this->id);

    if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        $this->nombre = $row['nombre'];
        $this->activo = $row['activo'];
        $this->imagen_principal = $this->getImagenPrincipal();
        return true;
      }
    } else {
      error_log("Error ejecutando la consulta readOne: " . implode(":", $stmt->errorInfo()));
    }

    return false;
  }

  function update()
  {
    $query = "UPDATE " . $this->table_name . " SET
                  nombre = :nombre,
                  activo = :activo
                  WHERE id = :id";

    $stmt = $this->conn->prepare($query);

    $this->nombre = htmlspecialchars(strip_tags($this->nombre));
    $this->activo = $this->activo ? 1 : 0;

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":activo", $this->activo);
    $stmt->bindParam(":id", $this->id);

    if ($stmt->execute()) {
      $this->updateImagenes();
      return true;
    } else {
      return false;
    }
  }

  public function updateImagenes()
  {
    if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
      $this->updateImagenPrincipal($_FILES['imagen_principal']);
    }

    if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
      $this->updateImagenesGenerales($_FILES['imagenes_generales']);
    }
  }

  private function updateImagenPrincipal($imagen)
{
    $target_dir = "../uploads/cursos/";
    
    // Verificar si la carpeta existe, si no, crearla
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $target_file = $target_dir . uniqid() . "_" . basename($imagen["name"]);

    if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
        $imagenAnterior = $this->getImagenPrincipal();
        if ($imagenAnterior && file_exists("../" . $imagenAnterior)) {
            unlink("../" . $imagenAnterior);
        }

        $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen
                      WHERE seccion = 'Cursos' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $ruta_relativa = "uploads/cursos/" . basename($target_file);
        $stmt->bindParam(":ruta_imagen", $ruta_relativa);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();

        $this->imagen_principal = $ruta_relativa;
    }
}

  private function updateImagenesGenerales($nuevasImagenes)
  {
    $target_dir = "../uploads/cursos/";
    $nuevasRutas = [];

    foreach ($nuevasImagenes['tmp_name'] as $key => $tmp_name) {
      if (!empty($tmp_name)) {
        $target_file = $target_dir . uniqid() . "_" . basename($nuevasImagenes["name"][$key]);
        if (move_uploaded_file($tmp_name, $target_file)) {
          $nuevasRutas[] = "uploads/cursos/" . basename($target_file);
        }
      }
    }

    if (!empty($nuevasRutas)) {
      $imagenesActuales = $this->getImagenesGenerales();

      foreach ($nuevasRutas as $ruta) {
        $this->saveImagenGeneral($ruta);
      }

      $this->imagenes_generales = array_merge($imagenesActuales, $nuevasRutas);
    }
  }

  public function saveImagenGeneral($ruta_imagen)
  {
    $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Cursos', :asociado_id, FALSE)";
    $stmt = $this->conn->prepare($query);

    $titulo = $this->nombre;
    $descripcion = "Galeria imagen";
    $asociado_id = $this->id;

    $stmt->bindParam(":titulo", $titulo);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":ruta_imagen", $ruta_imagen);
    $stmt->bindParam(":asociado_id", $asociado_id);

    $stmt->execute();
  }

  public function deleteImagenGeneral($rutaImagen)
  {
    $query = "DELETE FROM Imagenes WHERE seccion = 'Cursos' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->bindParam(":ruta_imagen", $rutaImagen);

    if ($stmt->execute()) {
      if (file_exists("../" . $rutaImagen)) {
        unlink("../" . $rutaImagen);
      }
      return true;
    } else {
      return false;
    }
  }

  public function desactivar()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = false WHERE id = :id";
    $stmt = $this->conn->prepare($query);
    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(':id', $this->id);
    if ($stmt->execute()) {
      $this->desactivarImagenes();
      return true;
    }
    return false;
  }

  public function activar()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = true WHERE id = :id";
    $stmt = $this->conn->prepare($query);
    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(':id', $this->id);
    if ($stmt->execute()) {
      $this->activarImagenes();
      return true;
    }
    return false;
  }

  private function desactivarImagenes()
  {
    $query = "UPDATE Imagenes SET activo = false WHERE seccion = 'Cursos' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }

  private function activarImagenes()
  {
    $query = "UPDATE Imagenes SET activo = true WHERE seccion = 'Cursos' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }

  function delete()
  {
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);

    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(1, $this->id);

    if ($stmt->execute()) {
      $this->deleteImagenes();
      return true;
    }
    return false;
  }

  public function getImagenPrincipal()
  {
    $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Cursos' AND asociado_id = :asociado_id AND principal = TRUE";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);

    if ($stmt->execute()) {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row ? $row['ruta_imagen'] : null;
    } else {
      error_log("Error ejecutando la consulta de imagen principal: " . implode(":", $stmt->errorInfo()));
      return null;
    }
  }

  private function deleteImagenes()
  {
    $query = "DELETE FROM Imagenes WHERE seccion = 'Cursos' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
  }
}
