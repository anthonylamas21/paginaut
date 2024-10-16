<?php
class Taller {
    private $conn;
    private $table_name = "Taller";

    public $id;
    public $nombre;
    public $descripcion;
    public $competencia;
    public $imagen;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear taller
    function create() {
        $query = "INSERT INTO " . $this->table_name . " (nombre, descripcion, competencia) 
                  VALUES (:nombre, :descripcion, :competencia)";
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
            $this->saveImagenTaller();
            return true;
        }
        return false;
    }

    // Guardar imagen asociada al taller
    private function saveImagenTaller() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Taller', :asociado_id, TRUE)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->nombre;
        $descripcion = $this->descripcion;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen));
        $asociado_id = $this->id;   

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    // Guardar imágenes generales asociadas al taller
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

    // Obtener todas las imágenes generales asociadas al taller
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

    private function updateImagenTaller($imagen_id) {
        $query = "UPDATE Imagenes SET titulo = :titulo, descripcion = :descripcion, ruta_imagen = :ruta_imagen 
                  WHERE id = :imagen_id AND seccion = 'Taller' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
    
        $titulo = $this->nombre;
        $descripcion = $this->descripcion;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen));
        $asociado_id = $this->id;   
    
        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);
        $stmt->bindParam(":imagen_id", $imagen_id);
    
        $stmt->execute();
    }

    // Leer todos los talleres
    function read() {
        $query = "SELECT id, nombre, descripcion, competencia FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
    
        $talleres_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->id = $row['id'];
            $row['imagen'] = $this->getImagenTaller();
            $row['imagenesGenerales'] = $this->getImagenesGenerales();
            array_push($talleres_arr, $row);
        }
    
        return $talleres_arr;
    }
    
    // Leer un taller por ID
    function readOne() {
        $query = "SELECT id, nombre, descripcion, competencia FROM " . $this->table_name . " WHERE id = ? ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->nombre = $row['nombre'];
            $this->descripcion = $row['descripcion'];
            $this->competencia = $row['competencia'];
            $this->imagen = $this->getImagenTaller();
            return true;
        }
        return false;
    }

    // Actualizar taller
    function update($nuevaImagenPrincipal = null, $nuevasImagenesGenerales = [], $imagenesGeneralesAEliminar = []) {
        $query = "UPDATE " . $this->table_name . " SET 
                  nombre = :nombre, 
                  descripcion = :descripcion, 
                  competencia = :competencia 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->competencia = htmlspecialchars(strip_tags($this->competencia));

        // Vincular parámetros
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":competencia", $this->competencia);

        if ($stmt->execute()) {
            // Actualizar imagen principal si se proporciona una nueva
            if ($nuevaImagenPrincipal) {
                $this->updateImagenPrincipal($nuevaImagenPrincipal);
            }

            // Agregar nuevas imágenes generales
            foreach ($nuevasImagenesGenerales as $nuevaImagen) {
                $this->saveImagenGeneral($nuevaImagen);
            }

            // Eliminar imágenes generales
            foreach ($imagenesGeneralesAEliminar as $imagenAEliminar) {
                $this->deleteImagenGeneral($imagenAEliminar);
            }

            return true;
        }
        return false;
    }

    // Actualizar imagen principal
    private function updateImagenPrincipal($nuevaRutaImagen) {
        $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen 
                  WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);

        $ruta_imagen = htmlspecialchars(strip_tags($nuevaRutaImagen));

        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $this->id);

        $stmt->execute();
    }

    // Eliminar una imagen general específica
    private function deleteImagenGeneral($rutaImagen) {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
        $stmt = $this->conn->prepare($query);

        $rutaImagen = htmlspecialchars(strip_tags($rutaImagen));

        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->bindParam(":ruta_imagen", $rutaImagen);

        $stmt->execute();

        // Eliminar el archivo físico
        if (file_exists($rutaImagen)) {
            unlink($rutaImagen);
        }
    }

    // Eliminar taller
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            $this->deleteImagenTaller();
            return true;
        }
        return false;
    }

    // Obtener imagen asociada al taller
    public function getImagenTaller() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }

    // Eliminar imagen asociada al taller
    private function deleteImagenTaller() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Taller' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
}
?>
