<?php
class Taller {
    private $conn;
    private $table_name = "Taller";

    public $id;
    public $nombre;
    public $descripcion;
    public $competencia;
    public $activo;
    public $imagen_principal;
    public $imagenes_generales;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear Taller
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (nombre, descripcion, competencia) 
                  VALUES 
                  (:nombre, :descripcion, :competencia)";
        
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->competencia = htmlspecialchars(strip_tags($this->competencia));

        // Vincular parámetros
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":competencia", $this->competencia);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->saveImagenPrincipal();
            return true;
        }
        return false;
    }

    // Guardar imagen principal asociada al Taller
    private function saveImagenPrincipal() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Taller', :asociado_id, TRUE)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->nombre;
        $descripcion = $this->descripcion;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen_principal));
        $asociado_id = $this->id;   
        $activo = $this->activo;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);;

        $stmt->execute();
    }

    // Obtener todas las imágenes generales asociadas al Taller
    public function getImagenesGenerales() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND principal = FALSE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $imagenes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $imagenes[] = $row['ruta_imagen'];
        }
        return $imagenes;
    }

    // Leer todos los talleres
    function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
    
        $talleres_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->id = $row['id'];
            $row['imagen_principal'] = $this->getImagenPrincipal();
            $row['imagenes_generales'] = $this->getImagenesGenerales();
            array_push($talleres_arr, $row);
        }
    
        return $talleres_arr;
    }
    
    // Leer un taller por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
    
        if ($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($row) {
                $this->nombre = $row['nombre'];
                $this->descripcion = $row['descripcion'];
                $this->competencia = $row['competencia'];
                $this->activo = $row['activo'];
                $this->imagen_principal = $this->getImagenPrincipal();
                return true;
            }
        } else {
            // Manejo de errores
            error_log("Error ejecutando la consulta readOne: " . implode(":", $stmt->errorInfo()));
        }
        
        return false;
    }
    

    // Actualizar Taller
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                  nombre = :nombre,
                  descripcion = :descripcion,
                  competencia = :competencia,
                  activo = :activo
                  WHERE id = :id";
    
        $stmt = $this->conn->prepare($query);
    
        // Sanear y vincular los parámetros
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->competencia = htmlspecialchars(strip_tags($this->competencia));
        $this->activo = $this->activo ? 1 : 0;
    
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":competencia", $this->competencia);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id", $this->id);
    
        error_log("Query de actualización: " . $query);
        error_log("Datos a actualizar: " . print_r($this, true));
    
        // Ejecutar la consulta
        if ($stmt->execute()) {
            $this->updateImagenes();
            return true;
        } else {
            return false;
        }
    }
    
    public function updateImagenes() {
        // Actualizar imagen principal si se proporcionó una nueva
        if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
            $this->updateImagenPrincipal($_FILES['imagen_principal']);
        }

        // Actualizar imágenes generales si se proporcionaron nuevas
        if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
            $this->updateImagenesGenerales($_FILES['imagenes_generales']);
        }
    }

    private function updateImagenPrincipal($imagen) {
        $target_dir = "../uploads/noticia/";
        $target_file = $target_dir . uniqid() . "_" . basename($imagen["name"]);
        
        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            // Eliminar la imagen anterior si existe
            $imagenAnterior = $this->getImagenPrincipal();
            if ($imagenAnterior && file_exists("../" . $imagenAnterior)) {
                unlink("../" . $imagenAnterior);
            }

            // Actualizar la ruta de la imagen en la base de datos
            $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen
                      WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND principal = TRUE";
            $stmt = $this->conn->prepare($query);
            $ruta_relativa = "uploads/noticia/" . basename($target_file);
            $stmt->bindParam(":ruta_imagen", $ruta_relativa);
            $stmt->bindParam(":asociado_id", $this->id);
            $stmt->execute();

            $this->imagen_principal = $ruta_relativa;
        }
    }
    
    private function updateImagenesGenerales($nuevasImagenes) {
        $target_dir = "../uploads/noticia/";
        $nuevasRutas = [];
    
        // Procesar cada nueva imagen
        foreach ($nuevasImagenes['tmp_name'] as $key => $tmp_name) {
            if (!empty($tmp_name)) {
                $target_file = $target_dir . uniqid() . "_" . basename($nuevasImagenes["name"][$key]);
                if (move_uploaded_file($tmp_name, $target_file)) {
                    $nuevasRutas[] = "uploads/noticia/" . basename($target_file);
                }
            }
        }
    
        if (!empty($nuevasRutas)) {
            // Obtener las imágenes generales actuales
            $imagenesActuales = $this->getImagenesGenerales();
    
            // Añadir las nuevas imágenes a la base de datos
            foreach ($nuevasRutas as $ruta) {
                $this->saveImagenGeneral($ruta);
            }

            // Actualizar la propiedad imagenes_generales
            $this->imagenes_generales = array_merge($imagenesActuales, $nuevasRutas);
        }
    }

    // Método para guardar una nueva imagen general
    public function saveImagenGeneral($ruta_imagen) {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Taller', :asociado_id, FALSE)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->nombre;
        $descripcion = $this->descripcion;
        $asociado_id = $this->id;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }
    
    // Método auxiliar para eliminar una imagen general de la base de datos
    public function deleteImagenGeneral($rutaImagen) {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND ruta_imagen =

 :ruta_imagen AND principal = FALSE";
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

    // Desactivar Taller y sus imágenes
    public function desactivar() {
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

    // Método para activar un Taller y sus imágenes
    public function activar() {
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

    private function desactivarImagenes() {
        $query = "UPDATE Imagenes SET activo = false WHERE seccion = 'Taller' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    private function activarImagenes() {
        $query = "UPDATE Imagenes SET activo = true WHERE seccion = 'Taller' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    // Eliminar Taller
    function delete() {
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

    // Obtener imagen principal asociada al Taller
    public function getImagenPrincipal() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
    
        if ($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? $row['ruta_imagen'] : null;
        } else {
            // Manejo de errores
            error_log("Error ejecutando la consulta de imagen principal: " . implode(":", $stmt->errorInfo()));
            return null;
        }
    }
    

    // Eliminar todas las imágenes asociadas al Taller
    private function deleteImagenes() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
}
?>