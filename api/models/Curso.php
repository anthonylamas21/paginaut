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

  function create() {
    $query = "INSERT INTO " . $this->table_name . " (nombre, descripcion, activo) VALUES (:nombre, :descripcion, :activo)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":activo", $this->activo);

    if ($stmt->execute()) {
        $this->id = $this->conn->lastInsertId(); // Obtener el ID del curso recién creado

        // Guardar imagen principal si está disponible
        if ($this->imagen_principal) {
            $this->saveImagenPrincipal();
        }

        // Guardar imágenes generales si están disponibles
        if (is_array($this->imagenes_generales) && !empty($this->imagenes_generales)) {
            $this->saveImagenesGenerales();
        }

        return true;
    }
    return false;
} 

function update()
{
    $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, descripcion = :descripcion, activo = :activo WHERE id = :id";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":nombre", $this->nombre);
    $stmt->bindParam(":descripcion", $this->descripcion);
    $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
    $stmt->bindParam(":id", $this->id);

    if ($stmt->execute()) {
        // Actualiza las imágenes si es necesario
        $this->updateImagenes();
        return true;
    }
    return false;
}

function asignarProfesor($profesor_id)
{
    $query = "INSERT INTO curso_maestro (curso_id, profesor_id) VALUES (:curso_id, :profesor_id)";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(':curso_id', $this->id);
    $stmt->bindParam(':profesor_id', $profesor_id);

    return $stmt->execute();
}

  function eliminarProfesores()
{
    $query = "DELETE FROM curso_maestro WHERE curso_id = :curso_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':curso_id', $this->id);
    $stmt->execute();
}


  function saveImagenPrincipal()
  {
    if ($this->imagen_principal) {
      $ruta = $this->uploadImage($this->imagen_principal, 'principal');
      $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal) VALUES (:titulo, :descripcion, :ruta_imagen, 'Cursos', :asociado_id, TRUE)";
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':titulo', $this->nombre);
      $stmt->bindParam(':descripcion', $this->descripcion);
      $stmt->bindParam(':ruta_imagen', $ruta);
      $stmt->bindParam(':asociado_id', $this->id);
      $stmt->execute();
    }
  }

  function saveImagenesGenerales()
  {
      // Si $_FILES['imagenes_generales'] es un array, procesa cada archivo
      if (is_array($this->imagenes_generales['tmp_name'])) {
          foreach ($this->imagenes_generales['tmp_name'] as $index => $tmpName) {
              $file = [
                  'name' => $this->imagenes_generales['name'][$index],
                  'type' => $this->imagenes_generales['type'][$index],
                  'tmp_name' => $tmpName,
                  'error' => $this->imagenes_generales['error'][$index],
                  'size' => $this->imagenes_generales['size'][$index],
              ];
              $ruta = $this->uploadImage($file, 'general');
              $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal) VALUES (:titulo, :descripcion, :ruta_imagen, 'Cursos', :asociado_id, FALSE)";
              $stmt = $this->conn->prepare($query);
              $stmt->bindParam(':titulo', $this->nombre);
              $stmt->bindParam(':descripcion', $this->descripcion);
              $stmt->bindParam(':ruta_imagen', $ruta);
              $stmt->bindParam(':asociado_id', $this->id);
              $stmt->execute();
          }
      }
  }
  

  function updateImagenes()
  {
      if ($this->imagen_principal) {
          $this->saveImagenPrincipal();
      }
  
      if (is_array($this->imagenes_generales) && isset($this->imagenes_generales['tmp_name']) && !empty($this->imagenes_generales['tmp_name'])) {
          $this->saveImagenesGenerales();
      }
  }
  

  private function uploadImage($image, $type)
  {
    $target_dir = "../../uploads/cursos/";
    if (!is_dir($target_dir)) {
      mkdir($target_dir, 0777, true);
    }
    $target_file = $target_dir . uniqid() . "_" . basename($image['name']);
    if (move_uploaded_file($image['tmp_name'], $target_file)) {
      return "uploads/cursos/" . basename($target_file);
    }
    return null;
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
        $this->fecha_creacion = $row['fecha_creacion'];
        $this->descripcion = $row['descripcion'];
        $this->imagen_principal = $this->getImagenPrincipal();
        return true;
      }
    } else {
      error_log("Error ejecutando la consulta readOne: " . implode(":", $stmt->errorInfo()));
    }

    return false;
  }

  private function updateImagenPrincipal($imagen)
{
    $target_dir = "../../uploads/cursos/";
    
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
