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

    // Crear carrera
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  (nombre_carrera, perfil_profesional, ocupacion_profesional, direccion_id, nivel_estudio_id, campo_estudio_id, activo)
                  VALUES
                  (:nombre_carrera, :perfil_profesional, :ocupacion_profesional, :direccion_id, :nivel_estudio_id, :campo_estudio_id, :activo)";

        $stmt = $this->conn->prepare($query);

        $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
        $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
        $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
        $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
        $this->nivel_estudio_id = htmlspecialchars(strip_tags($this->nivel_estudio_id));
        $this->campo_estudio_id = htmlspecialchars(strip_tags($this->campo_estudio_id));
        $this->activo = $this->activo ? 1 : 0;

        $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
        $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
        $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
        $stmt->bindParam(":direccion_id", $this->direccion_id);
        $stmt->bindParam(":nivel_estudio_id", $this->nivel_estudio_id);
        $stmt->bindParam(":campo_estudio_id", $this->campo_estudio_id);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();

            if (!empty($_FILES['imagen_principal']['name'])) {
                $this->saveImagenPrincipal($_FILES['imagen_principal']);
            }

            if (!empty($_FILES['imagenes_generales']['name'][0])) {
                $this->saveImagenesGenerales($_FILES['imagenes_generales']);
            }

            // Recuperar las imágenes después de guardarlas
            $this->imagen_principal = $this->getImagenPrincipal();
            $this->imagenes_generales = $this->getImagenesGenerales();

            return true;
        }
        return false;
    }


    // Guardar imagen principal
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
            $asociado_id = $this->id;
            $activo = $this->activo;

            $stmt->bindParam(":titulo", $titulo);
            $stmt->bindParam(":descripcion", $descripcion);
            $stmt->bindParam(":ruta_imagen", $ruta_imagen);
            $stmt->bindParam(":asociado_id", $asociado_id);
            $stmt->bindParam(":activo", $activo);

            $stmt->execute();
        }
    }

    // Guardar imágenes generales
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
                    $asociado_id = $this->id;
                    $activo = $this->activo;

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
        error_log("Obteniendo imagen principal para el ID: " . $this->id);

        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND principal = TRUE LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            error_log("Ruta de la imagen principal: " . $row['ruta_imagen']);
            return $row['ruta_imagen'];
        } else {
            error_log("No se encontró imagen principal.");
        }

        return null;
    }



    // Método para actualizar la carrera
    public function update()
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
            if (!empty($_FILES['imagen_principal'])) {
                $this->updateImagenPrincipal($_FILES['imagen_principal']);
            }

            if (!empty($_FILES['imagenes_generales']['tmp_name'][0])) {
                $this->updateImagenesGenerales($_FILES['imagenes_generales']);
            }

            return true;
        }
        return false;
    }

    // Actualizar imagen principal
    public function updateImagenPrincipal($imagen)
    {
        $target_dir = "../uploads/carrera/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $target_file = $target_dir . uniqid() . "_" . basename($imagen["name"]);

        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            $imagenAnterior = $this->getImagenPrincipal();
            if ($imagenAnterior && file_exists("../" . $imagenAnterior)) {
                unlink("../" . $imagenAnterior);
            }

            $ruta_relativa = "uploads/carrera/" . basename($target_file);

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

    // Actualizar imágenes generales
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

    // Guardar una nueva imagen general
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

    // Leer todas las carreras
    public function read()
    {
        $query = "SELECT c.*,
                         d.nombre AS direccion_nombre,
                         n.nivel AS nivel_estudio_nombre,
                         ce.campo AS campo_estudio_nombre,
                         (SELECT ruta_imagen
                          FROM Imagenes
                          WHERE seccion = 'Carrera'
                          AND asociado_id = c.id
                          AND principal = TRUE
                          LIMIT 1) as imagen_principal
                  FROM " . $this->table_name . " c
                  JOIN Direccion d ON c.direccion_id = d.id
                  JOIN NivelesEstudios n ON c.nivel_estudio_id = n.id
                  JOIN CampoEstudio ce ON c.campo_estudio_id = ce.id
                  ORDER BY fecha_creacion DESC";

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            $carreras = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Obtenemos las imágenes generales
                $this->id = $row['id'];
                $row['imagenes_generales'] = $this->getImagenesGenerales();

                // Añadir la carrera con sus imágenes al array
                $carreras[] = $row;
            }

            return $carreras;  // Retorna el array de carreras con sus imágenes
        } else {
            // Manejo de errores, si la consulta falla
            return null;
        }
    }


    // Leer una carrera por ID
    public function readOne()
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
            // Asegúrate de que el ID se asigna correctamente
            $this->id = $row['id'];
            error_log("ID de la carrera asignado: " . $this->id);

            $this->nombre_carrera = $row['nombre_carrera'];
            $this->perfil_profesional = $row['perfil_profesional'];
            $this->ocupacion_profesional = $row['ocupacion_profesional'];
            $this->direccion_id = $row['direccion_id'];
            $this->nivel_estudio_id = $row['nivel_estudio_id'];
            $this->campo_estudio_id = $row['campo_estudio_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];

            // Asignar la imagen principal
            $this->imagen_principal = $this->getImagenPrincipal();
            error_log("Imagen principal en readOne: " . $this->imagen_principal);

            // Asignar las imágenes generales
            $this->imagenes_generales = $this->getImagenesGenerales();
            error_log("Imágenes generales en readOne: " . json_encode($this->imagenes_generales));

            return true;
        } else {
            error_log("No se encontró la carrera con ID: " . $this->id);
        }
        return false;
    }




    // Actualizar el estado de la carrera
    public function updateStatus($activo)
    {
        $query = "UPDATE " . $this->table_name . "
                  SET activo = :activo
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->activo = $activo;

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Eliminar carrera
    public function delete()
    {
        // Eliminar asignaturas relacionadas con cuatrimestres de la carrera
        $queryAsignaturas = "DELETE FROM Asignatura WHERE cuatrimestre_id IN (
                                SELECT id FROM Cuatrimestre WHERE carrera_id = :carrera_id)";
        $stmtAsignaturas = $this->conn->prepare($queryAsignaturas);
        $stmtAsignaturas->bindParam(":carrera_id", $this->id);
        $stmtAsignaturas->execute();

        // Eliminar cuatrimestres relacionados con la carrera
        $queryCuatrimestres = "DELETE FROM Cuatrimestre WHERE carrera_id = :carrera_id";
        $stmtCuatrimestres = $this->conn->prepare($queryCuatrimestres);
        $stmtCuatrimestres->bindParam(":carrera_id", $this->id);
        $stmtCuatrimestres->execute();

        // Eliminar imágenes asociadas a la carrera
        $this->deleteImagenes();

        // Finalmente, eliminar la carrera
        $queryCarrera = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmtCarrera = $this->conn->prepare($queryCarrera);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmtCarrera->bindParam(1, $this->id);

        if ($stmtCarrera->execute()) {
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
