<?php
class Convocatoria
{
    private $conn;
    private $table_name = "Convocatoria";

    public $id;
    public $titulo;
    public $descripcion;
    public $activo;
    public $lugar;
    public $fecha_inicio;
    public $fecha_fin;
    public $hora_inicio;
    public $hora_fin;
    public $es_curso;
    public $curso_id;
    public $fecha_creacion;
    public $imagen_principal;
    public $imagenes_generales = [];
    public $archivos = [];

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Crear convocatoria
    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  (titulo, descripcion, activo, lugar, fecha_inicio, fecha_fin, hora_inicio, hora_fin, es_curso, curso_id)
                  VALUES
                  (:titulo, :descripcion, :activo, :lugar, :fecha_inicio, :fecha_fin, :hora_inicio, :hora_fin, :es_curso, :curso_id)";

        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar = htmlspecialchars(strip_tags($this->lugar));
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));
        $this->es_curso = $this->es_curso ? 1 : 0;

        // Vincular parámetros
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar", $this->lugar);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":es_curso", $this->es_curso);

        if (!empty($this->curso_id)) {
            $stmt->bindParam(":curso_id", $this->curso_id, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(":curso_id", null, PDO::PARAM_NULL);
        }

        if ($stmt->execute()) {
            // Obtener el ID de la convocatoria recién creada
            $query = "SELECT id FROM " . $this->table_name . " WHERE titulo = :titulo AND descripcion = :descripcion AND lugar = :lugar ORDER BY fecha_creacion DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":titulo", $this->titulo);
            $stmt->bindParam(":descripcion", $this->descripcion);
            $stmt->bindParam(":lugar", $this->lugar);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $this->id = $row['id'];

                if (!empty($_FILES['imagen_principal'])) {
                    $this->imagen_principal = $_FILES['imagen_principal'];
                    $this->saveImagenPrincipal($this->id);  // Guardar imagen principal
                }
                $this->saveImagenesGenerales($this->id);  // Guardar imágenes generales
                $this->saveArchivos($this->id);  // Guardar archivos

                return true;
            } else {
                return false;
            }
        }
        return false;
    }


    // Guardar imagen principal asociada a la convocatoria
    private function saveImagenPrincipal($asociado_id)
    {
        if (!empty($this->imagen_principal)) {
            $target_dir = "../uploads/convocatoria/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $target_file = $target_dir . uniqid() . "_" . basename($this->imagen_principal["name"]);
            if (move_uploaded_file($this->imagen_principal["tmp_name"], $target_file)) {
                $ruta_relativa = "uploads/convocatoria/" . basename($target_file);

                $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                          VALUES (:titulo, :descripcion, :ruta_imagen, 'Convocatoria', :asociado_id, TRUE, :activo)";
                $stmt = $this->conn->prepare($query);

                $stmt->bindParam(":titulo", $this->titulo);
                $stmt->bindParam(":descripcion", $this->descripcion);
                $stmt->bindParam(":ruta_imagen", $ruta_relativa);
                $stmt->bindParam(":asociado_id", $asociado_id);
                $stmt->bindParam(":activo", $this->activo);

                $stmt->execute();
            }
        }
    }

    // Guardar imágenes generales asociadas a la convocatoria
    private function saveImagenesGenerales($asociado_id)
    {
        if (!empty($this->imagenes_generales)) {
            $target_dir = "../uploads/convocatoria/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                      VALUES (:titulo, :descripcion, :ruta_imagen, 'Convocatoria', :asociado_id, FALSE, :activo)";
            $stmt = $this->conn->prepare($query);

            foreach ($this->imagenes_generales['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($this->imagenes_generales["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $ruta_imagen = htmlspecialchars(strip_tags("uploads/convocatoria/" . basename($target_file)));

                        $stmt->bindParam(":titulo", $this->titulo);
                        $stmt->bindParam(":descripcion", $this->descripcion);
                        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
                        $stmt->bindParam(":asociado_id", $asociado_id);
                        $stmt->bindParam(":activo", $this->activo);

                        $stmt->execute();
                    }
                }
            }
        }
    }

  // Guardar archivos asociados al evento
    // Guardar archivos asociados a la convocatoria
    private function saveArchivos($asociado_id)
    {
        if (!empty($this->archivos)) {
            $target_dir = "../uploads/convocatoria/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id, activo)
                      VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Convocatoria', :asociado_id, :activo)";
            $stmt = $this->conn->prepare($query);

            foreach ($this->archivos['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($this->archivos["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $nombre_archivo = htmlspecialchars(strip_tags($this->archivos["name"][$key]));
                        $ruta_archivo = htmlspecialchars(strip_tags("uploads/convocatoria/" . basename($target_file)));
                        $tipo_archivo = htmlspecialchars(strip_tags($this->archivos["type"][$key]));

                        $stmt->bindParam(":nombre_archivo", $nombre_archivo);
                        $stmt->bindParam(":ruta_archivo", $ruta_archivo);
                        $stmt->bindParam(":tipo_archivo", $tipo_archivo);
                        $stmt->bindParam(":asociado_id", $asociado_id);
                        $stmt->bindParam(":activo", $this->activo);

                        $stmt->execute();
                    }
                }
            }
        }
    }

    // Obtener todas las imágenes generales asociadas a la convocatoria
    public function getImagenesGenerales()
    {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND principal = FALSE AND activo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $imagenes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $imagenes[] = $row['ruta_imagen'];
        }
        return $imagenes;
    }

    // Obtener todos los archivos asociados a la convocatoria
    public function getArchivos()
    {
        $query = "SELECT ruta_archivo, nombre_archivo, tipo_archivo FROM Archivos WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND activo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $archivos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $archivos[] = $row;
        }
        return $archivos;
    }

    // Leer todas las convocatorias
    function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $convocatorias_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->id = $row['id'];
            $row['imagen_principal'] = $this->getImagenPrincipal();
            $row['imagenes_generales'] = $this->getImagenesGenerales();
            $row['archivos'] = $this->getArchivos();
            array_push($convocatorias_arr, $row);
        }

        return $convocatorias_arr;
    }

    // Leer una convocatoria por ID
    function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->titulo = $row['titulo'];
            $this->descripcion = $row['descripcion'];
            $this->activo = $row['activo'];
            $this->lugar = $row['lugar'];
            $this->fecha_inicio = $row['fecha_inicio'];
            $this->fecha_fin = $row['fecha_fin'];
            $this->hora_inicio = $row['hora_inicio'];
            $this->hora_fin = $row['hora_fin'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->imagen_principal = $this->getImagenPrincipal();
            return true;
        }
        return false;
    }

    // Actualizar convocatoria
    public function update()
    {
        $query = "UPDATE " . $this->table_name . " SET
                  titulo = :titulo,
                  descripcion = :descripcion,
                  activo = :activo,
                  lugar = :lugar,
                  fecha_inicio = :fecha_inicio,
                  fecha_fin = :fecha_fin,
                  hora_inicio = :hora_inicio,
                  hora_fin = :hora_fin,
                  es_curso = :es_curso,
                  curso_id = :curso_id
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanear y vincular los parámetros
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar = htmlspecialchars(strip_tags($this->lugar));
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));
        $this->es_curso = $this->es_curso ? 1 : 0;
        $this->curso_id = !empty($this->curso_id) ? intval($this->curso_id) : null;

        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar", $this->lugar);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":es_curso", $this->es_curso);
        $stmt->bindParam(":curso_id", $this->curso_id);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            // Actualizar imágenes generales o eliminar las seleccionadas para eliminar
            if (isset($_POST['imagenes_a_eliminar']) && is_array($_POST['imagenes_a_eliminar'])) {
                foreach ($_POST['imagenes_a_eliminar'] as $rutaImagen) {
                    $this->deleteImagenGeneral($rutaImagen);
                }
            }

            // Actualizar imagen principal
            if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
                $this->updateImagenPrincipal($_FILES['imagen_principal']);
            }

            // Actualizar imágenes generales
            if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
                $this->updateImagenesGenerales($_FILES['imagenes_generales']);
            }

            return true;
        } else {
            return false;
        }
    }

    // Método auxiliar para eliminar una imagen general de la base de datos
    public function deleteImagenGeneral($rutaImagen)
    {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
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

    // Método para eliminar una convocatoria
    function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            $this->deleteImagenes();
            $this->deleteArchivos();
            return true;
        }
        return false;
    }



  public function updateImagenPrincipal($imagen)
  {
    $target_dir = "../uploads/convocatoria/";
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

      $ruta_relativa = "uploads/convocatoria/" . basename($target_file);

      // Primero, intentamos actualizar la imagen existente
      $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen, activo = :activo
                      WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND principal = TRUE";
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
                          VALUES (:titulo, :descripcion, :ruta_imagen, 'Convocatoria', :asociado_id, TRUE, :activo)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":descripcion", $this->descripcion);
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
      $target_dir = "../uploads/convocatoria/";
      if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
      }

      $nuevasRutas = [];

      foreach ($nuevasImagenes['tmp_name'] as $key => $tmp_name) {
        if (!empty($tmp_name)) {
          $target_file = $target_dir . uniqid() . "_" . basename($nuevasImagenes["name"][$key]);
          if (move_uploaded_file($tmp_name, $target_file)) {
            $nuevasRutas[] = "uploads/convocatoria/" . basename($target_file);
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

  public function updateArchivos($nuevosArchivos)
  {
    if ($nuevosArchivos && is_array($nuevosArchivos['tmp_name'])) {
      $target_dir = "../uploads/convocatoria/";
      if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
      }

      $nuevasRutas = [];

      foreach ($nuevosArchivos['tmp_name'] as $key => $tmp_name) {
        if (!empty($tmp_name)) {
          $target_file = $target_dir . uniqid() . "_" . basename($nuevosArchivos["name"][$key]);
          if (move_uploaded_file($tmp_name, $target_file)) {
            $nuevasRutas[] = [
              'ruta_archivo' => "uploads/convocatoria/" . basename($target_file),
              'nombre_archivo' => $nuevosArchivos["name"][$key],
              'tipo_archivo' => $nuevosArchivos["type"][$key]
            ];
          }
        }
      }

      if (!empty($nuevasRutas)) {
        foreach ($nuevasRutas as $archivo) {
          $this->saveArchivo($archivo);
        }

        $this->archivos = array_merge($this->getArchivos(), $nuevasRutas);
      }
    } else {
      error_log("Error: \$nuevosArchivos no es un array válido o está vacío");
    }
  }

  // Método para guardar una nueva imagen general
  public function saveImagenGeneral($ruta_imagen)
  {
    $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Convocatoria', :asociado_id, FALSE, :activo)";
    $stmt = $this->conn->prepare($query);

    $titulo = $this->titulo;
    $descripcion = $this->descripcion;
    $asociado_id = $this->id;
    $activo = $this->activo;

    $stmt->bindParam(":titulo", $titulo);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":ruta_imagen", $ruta_imagen);
    $stmt->bindParam(":asociado_id", $asociado_id);
    $stmt->bindParam(":activo", $activo);

    $stmt->execute();
  }

  // Método para guardar un nuevo archivo
  public function saveArchivo($archivo)
  {
    $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id, activo)
                  VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Convocatoria', :asociado_id, :activo)";
    $stmt = $this->conn->prepare($query);

    $nombre_archivo = htmlspecialchars(strip_tags($archivo['nombre_archivo']));
    $ruta_archivo = htmlspecialchars(strip_tags($archivo['ruta_archivo']));
    $tipo_archivo = htmlspecialchars(strip_tags($archivo['tipo_archivo']));
    $asociado_id = $this->id;
    $activo = $this->activo;

    $stmt->bindParam(":nombre_archivo", $nombre_archivo);
    $stmt->bindParam(":ruta_archivo", $ruta_archivo);
    $stmt->bindParam(":tipo_archivo", $tipo_archivo);
    $stmt->bindParam(":asociado_id", $asociado_id);
    $stmt->bindParam(":activo", $activo);

    $stmt->execute();
  }


  // Método auxiliar para eliminar un archivo de la base de datos
  public function deleteArchivo($rutaArchivo)
  {
    $query = "DELETE FROM Archivos WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND ruta_archivo = :ruta_archivo";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->bindParam(":ruta_archivo", $rutaArchivo);

    if ($stmt->execute()) {
      if (file_exists("../" . $rutaArchivo)) {
        unlink("../" . $rutaArchivo);
      }
      return true;
    } else {
      return false;
    }
  }

  // Método para desactivar un evento y sus recursos asociados
  public function desactivar()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = false WHERE id = :id";
    $stmt = $this->conn->prepare($query);
    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(':id', $this->id);
    if ($stmt->execute()) {
      $this->desactivarImagenes();
      $this->desactivarArchivos();
      return true;
    }
    return false;
  }

  // Método para activar un evento y sus recursos asociados
  public function activar()
  {
    $query = "UPDATE " . $this->table_name . " SET activo = true WHERE id = :id";
    $stmt = $this->conn->prepare($query);
    $this->id = htmlspecialchars(strip_tags($this->id));
    $stmt->bindParam(':id', $this->id);
    if ($stmt->execute()) {
      $this->activarImagenes();
      $this->activarArchivos();
      return true;
    }
    return false;
  }

  private function desactivarImagenes()
  {
    $query = "UPDATE Imagenes SET activo = false WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }

  private function activarImagenes()
  {
    $query = "UPDATE Imagenes SET activo = true WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }

  private function desactivarArchivos()
  {
    $query = "UPDATE Archivos SET activo = false WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }

  private function activarArchivos()
  {
    $query = "UPDATE Archivos SET activo = true WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':asociado_id', $this->id);
    $stmt->execute();
  }



  // Obtener imagen principal asociada al Convocatoria
  public function getImagenPrincipal()
  {
      $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id AND principal = TRUE";
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(":asociado_id", $this->id);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row ? $row['ruta_imagen'] : null;
  }


  // Eliminar todas las imágenes asociadas al Convocatoria
  private function deleteImagenes()
  {
    $query = "DELETE FROM Imagenes WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
  }

  // Eliminar todos los archivos asociados al Convocatoria
  private function deleteArchivos()
  {
    $query = "DELETE FROM Archivos WHERE seccion = 'Convocatoria' AND asociado_id = :asociado_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":asociado_id", $this->id);
    $stmt->execute();
  }
  public function readRecent($limit = 5)
  {
    $query = "SELECT * FROM " . $this->table_name . "
                  WHERE activo = TRUE
                  ORDER BY fecha_inicio DESC
                  LIMIT :limit";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
    $stmt->execute();

    $eventos_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $this->id = $row['id'];
      $row['imagen_principal'] = $this->getImagenPrincipal();
      $row['imagenes_generales'] = $this->getImagenesGenerales();
      $row['archivos'] = $this->getArchivos();
      array_push($eventos_arr, $row);
    }

    return $eventos_arr;
  }
}