<?php
class Carrera
{
  private $conn;
  private $table_name = "Carrera";

  public $id;
  public $nombre_carrera;
  public $perfil_profesional;
  public $ocupacion_profesional;
  public $direccion_id;
  public $nivel_estudio_id;
  public $campo_estudio_id;
  public $activo;
  public $fecha_creacion;
  public $imagen_principal;
  public $imagenes_generales = [];

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Método para crear una nueva carrera
  public function create()
  {
      $query = "INSERT INTO " . $this->table_name . "
                (nombre_carrera, perfil_profesional, ocupacion_profesional, direccion_id, nivel_estudio_id, campo_estudio_id, activo)
                VALUES
                (:nombre_carrera, :perfil_profesional, :ocupacion_profesional, :direccion_id, :nivel_estudio_id, :campo_estudio_id, :activo)";
  
      $stmt = $this->conn->prepare($query);
  
      // Sanear los datos de entrada
      $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
      $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
      $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
      $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
      $this->nivel_estudio_id = htmlspecialchars(strip_tags($this->nivel_estudio_id));
      $this->campo_estudio_id = htmlspecialchars(strip_tags($this->campo_estudio_id));
      $this->activo = $this->activo ? 1 : 0;
  
      // Vincular parámetros
      $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
      $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
      $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
      $stmt->bindParam(":direccion_id", $this->direccion_id);
      $stmt->bindParam(":nivel_estudio_id", $this->nivel_estudio_id);
      $stmt->bindParam(":campo_estudio_id", $this->campo_estudio_id);
      $stmt->bindParam(":activo", $this->activo);
  
      if ($stmt->execute()) {
          $lastInsertId = $this->conn->lastInsertId();
          error_log("lastInsertId(): " . $lastInsertId);
  
          // Obtener el ID real de la base de datos
          $queryLastId = "SELECT MAX(id) as last_id FROM " . $this->table_name;
          $stmtLastId = $this->conn->prepare($queryLastId);
          $stmtLastId->execute();
          $resultLastId = $stmtLastId->fetch(PDO::FETCH_ASSOC);
          $this->id = $resultLastId['last_id'];
          error_log("ID real de la base de datos: " . $this->id);
  
          // Guardar imagen principal
          if (!empty($_FILES['imagen_principal']['name'])) {
              $this->saveImagenPrincipal($_FILES['imagen_principal']);
          }
          
          // Guardar imágenes generales
          if (!empty($_FILES['imagenes_generales']['name'][0])) {
              $this->saveImagenesGenerales($_FILES['imagenes_generales']);
          }
  
          return true;
      }
      return false;
  }
  
  private function saveImagenPrincipal($imagen)
  {
      $target_dir = "../uploads/carrera/";
      if (!file_exists($target_dir)) {
          mkdir($target_dir, 0777, true);
      }
  
      $target_file = $target_dir . uniqid() . "_" . basename($imagen["name"]);
      if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
          $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                    VALUES (:titulo, :descripcion, :ruta_imagen, 'Carrera', :asociado_id, TRUE, :activo)";
          $stmt = $this->conn->prepare($query);
  
          $titulo = $this->nombre_carrera;
          $descripcion = $this->perfil_profesional;
          $ruta_imagen = htmlspecialchars(strip_tags("uploads/carrera/" . basename($target_file)));
          $asociado_id = $this->id; // Usar el ID correcto
          $activo = $this->activo;
  
          error_log("ID usado para imagen principal: " . $asociado_id);
  
          $stmt->bindParam(":titulo", $titulo);
          $stmt->bindParam(":descripcion", $descripcion);
          $stmt->bindParam(":ruta_imagen", $ruta_imagen);
          $stmt->bindParam(":asociado_id", $asociado_id);
          $stmt->bindParam(":activo", $activo);
  
          $stmt->execute();
      }
  }
  
  private function saveImagenesGenerales($imagenes)
  {
      $target_dir = "../uploads/carrera/";
      if (!file_exists($target_dir)) {
          mkdir($target_dir, 0777, true);
      }
  
      $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                VALUES (:titulo, :descripcion, :ruta_imagen, 'Carrera', :asociado_id, FALSE, :activo)";
      $stmt = $this->conn->prepare($query);
  
      foreach ($imagenes['tmp_name'] as $key => $tmp_name) {
          if (!empty($tmp_name)) {
              $target_file = $target_dir . uniqid() . "_" . basename($imagenes['name'][$key]);
              if (move_uploaded_file($tmp_name, $target_file)) {
                  $titulo = $this->nombre_carrera;
                  $descripcion = $this->perfil_profesional;
                  $ruta_imagen = htmlspecialchars(strip_tags("uploads/carrera/" . basename($target_file)));
                  $asociado_id = $this->id; // Usar el ID correcto
                  $activo = $this->activo;
  
                  error_log("ID usado para imagen general: " . $asociado_id);
  
                  $stmt->bindParam(":titulo", $titulo);
                  $stmt->bindParam(":descripcion", $descripcion);
                  $stmt->bindParam(":ruta_imagen", $ruta_imagen);
                  $stmt->bindParam(":asociado_id", $asociado_id);
                  $stmt->bindParam(":activo", $activo);
  
                  $stmt->execute();
              }
          }
      }
  }
  
  
  

  // Obtener todas las imágenes generales asociadas a la carrera
  public function getImagenesGenerales()
  {
    $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND principal = FALSE AND activo = true";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
    $imagenes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $imagenes[] = $row['ruta_imagen'];
    }
    return $imagenes;
  }

  // Obtener imagen principal asociada a la carrera
  public function getImagenPrincipal()
  {
    $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND principal = TRUE";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row['ruta_imagen'] : null;
  }

  // Método para actualizar la carrera
  function update()
  {
    $query = "UPDATE " . $this->table_name . " SET
                nombre_carrera = :nombre_carrera,
                perfil_profesional = :perfil_profesional,
                ocupacion_profesional = :ocupacion_profesional,
                direccion_id = :direccion_id,
                nivel_estudio_id = :nivel_estudio_id,
                campo_estudio_id = :campo_estudio_id,
                activo = :activo
                WHERE id = :id";

    $stmt = $this->conn->prepare($query);

    // Sanear y vincular los parámetros
    $this->id = htmlspecialchars(strip_tags($this->id));
    $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
    $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
    $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
    $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
    $this->nivel_estudio_id = htmlspecialchars(strip_tags($this->nivel_estudio_id));
    $this->campo_estudio_id = htmlspecialchars(strip_tags($this->campo_estudio_id));
    $this->activo = htmlspecialchars(strip_tags($this->activo));

    $stmt->bindParam(':id', $this->id);
    $stmt->bindParam(':nombre_carrera', $this->nombre_carrera);
    $stmt->bindParam(':perfil_profesional', $this->perfil_profesional);
    $stmt->bindParam(':ocupacion_profesional', $this->ocupacion_profesional);
    $stmt->bindParam(':direccion_id', $this->direccion_id);
    $stmt->bindParam(':nivel_estudio_id', $this->nivel_estudio_id);
    $stmt->bindParam(':campo_estudio_id', $this->campo_estudio_id);
    $stmt->bindParam(':activo', $this->activo);

    if ($stmt->execute()) {
      // Actualizar imagen principal si se proporcionó una nueva
      if (!empty($_FILES['imagen_principal'])) {
        $this->updateImagenPrincipal($_FILES['imagen_principal']);
      }

      // Actualizar imágenes generales si se proporcionaron nuevas
      if (!empty($_FILES['imagenes_generales']['tmp_name'][0])) {
        $this->updateImagenesGenerales($_FILES['imagenes_generales']);
      }

      return true;
    }
    return false;
  }

  public function updateImagenPrincipal($imagen)
  {
    $target_dir = "../uploads/carrera/";
    if (!file_exists($target_dir)) {
      mkdir($target_dir, 0777, true);
    }

    $target_file = $target_dir . uniqid() . "_" . basename($imagen["name"]);

    if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
      // Eliminar la imagen anterior si existe
      $imagenAnterior = $this->getImagenPrincipal();
      if ($imagenAnterior && file_exists("../" . $imagenAnterior)) {
        unlink("../" . $imagenAnterior);
      }

      $ruta_relativa = "uploads/carrera/" . basename($target_file);

      // Primero, intentamos actualizar la imagen existente
      $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen, activo = :activo
                      WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND principal = TRUE";
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(":ruta_imagen", $ruta_relativa);
      $stmt->bindParam(":activo", $this->activo);
      $stmt->bindParam(":asociado_id", $this->id);

      if ($stmt->execute() && $stmt->rowCount() > 0) {
        $this->imagen_principal = $ruta_relativa;
        return true;
      } else {
        // Si no se actualizó ninguna fila, insertamos una nueva imagen
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                          VALUES (:titulo, :descripcion, :ruta_imagen, 'Carrera', :asociado_id, TRUE, :activo)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":titulo", $this->nombre_carrera);
        $stmt->bindParam(":descripcion", $this->perfil_profesional);
        $stmt->bindParam(":ruta_imagen", $ruta_relativa);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
          $this->imagen_principal = $ruta_relativa;
          return true;
        }
      }
    }
    return false;
  }

  public function updateImagenesGenerales($nuevasImagenes)
  {
    if ($nuevasImagenes && is_array($nuevasImagenes['tmp_name'])) {
      $target_dir = "../uploads/carrera/";
      if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
      }

      $nuevasRutas = [];

      foreach ($nuevasImagenes['tmp_name'] as $key => $tmp_name) {
        if (!empty($tmp_name)) {
          $target_file = $target_dir . uniqid() . "_" . basename($nuevasImagenes["name"][$key]);
          if (move_uploaded_file($tmp_name, $target_file)) {
            $nuevasRutas[] = "uploads/carrera/" . basename($target_file);
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
    } else {
      error_log("Error: \$nuevasImagenes no es un array válido o está vacío");
    }
  }

  // Método para guardar una nueva imagen general
  public function saveImagenGeneral($ruta_imagen)
  {
    $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Carrera', :asociado_id, FALSE, :activo)";
    $stmt = $this->conn->prepare($query);

    $titulo = $this->nombre_carrera;
    $descripcion = $this->perfil_profesional;
    $asociado_id = $this->id;
    $activo = $this->activo;

    $stmt->bindParam(":titulo", $titulo);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":ruta_imagen", $ruta_imagen);
    $stmt->bindParam(":asociado_id", $asociado_id);
    $stmt->bindParam(":activo", $activo);

    $stmt->execute();
  }

  // Método auxiliar para eliminar una imagen general de la base de datos
  public function deleteImagenGeneral($rutaImagen)
  {
    $query = "DELETE FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
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
  
  // Leer todas las carreras
  function read()
  {
    $query = "SELECT c.*, 
                     d.nombre AS direccion_nombre, 
                     n.nivel AS nivel_estudio_nombre, 
                     ce.campo AS campo_estudio_nombre
              FROM " . $this->table_name . " c
              JOIN Direccion d ON c.direccion_id = d.id
              JOIN NivelesEstudios n ON c.nivel_estudio_id = n.id
              JOIN CampoEstudio ce ON c.campo_estudio_id = ce.id
              ORDER BY fecha_creacion DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    return $stmt;
  }

  // Leer una carrera por ID
  function readOne()
  {
    $query = "SELECT c.*, 
                     d.nombre AS direccion_nombre, 
                     n.nivel AS nivel_estudio_nombre, 
                     ce.campo AS campo_estudio_nombre
              FROM " . $this->table_name . " c
              JOIN Direccion d ON c.direccion_id = d.id
              JOIN NivelesEstudios n ON c.nivel_estudio_id = n.id
              JOIN CampoEstudio ce ON c.campo_estudio_id = ce.id
              WHERE c.id = ?
              LIMIT 1";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $this->nombre_carrera = $row['nombre_carrera'];
      $this->perfil_profesional = $row['perfil_profesional'];
      $this->ocupacion_profesional = $row['ocupacion_profesional'];
      $this->direccion_id = $row['direccion_id'];
      $this->nivel_estudio_id = $row['nivel_estudio_id'];
      $this->campo_estudio_id = $row['campo_estudio_id'];
      $this->activo = $row['activo'];
      $this->fecha_creacion = $row['fecha_creacion'];
      $this->imagen_principal = $this->getImagenPrincipal();
      $this->imagenes_generales = $this->getImagenesGenerales();
      return true;
    }
    return false;
  }

  // Método para actualizar el estado de la carrera
  function updateStatus()
  {
    $query = "UPDATE " . $this->table_name . "
                  SET
                    activo = :activo
                  WHERE
                    id = :id";
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

  // Eliminar carrera
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

  // Eliminar todas las imágenes asociadas a la carrera
  private function deleteImagenes()
  {
    $query = "DELETE FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
  }
}
?>
