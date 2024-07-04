<?php
class Noticia {
    private $conn;
    private $table_name = "Noticia";

    public $id;
    public $titulo;
    public $resumen;
    public $informacion_noticia;
    public $activo;
    public $lugar_noticia;
    public $autor;
    public $fecha_publicacion;
    public $fecha_creacion;
    public $imagen_principal;
    public $imagenes_generales;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear noticia
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (titulo, resumen, informacion_noticia, activo, lugar_noticia, autor, fecha_publicacion) 
                  VALUES 
                  (:titulo, :resumen, :informacion_noticia, :activo, :lugar_noticia, :autor, :fecha_publicacion)";
        
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->resumen = htmlspecialchars(strip_tags($this->resumen));
        $this->informacion_noticia = htmlspecialchars(strip_tags($this->informacion_noticia));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar_noticia = htmlspecialchars(strip_tags($this->lugar_noticia));
        $this->autor = htmlspecialchars(strip_tags($this->autor));
        $this->fecha_publicacion = htmlspecialchars(strip_tags($this->fecha_publicacion));

        // Vincular parámetros
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":resumen", $this->resumen);
        $stmt->bindParam(":informacion_noticia", $this->informacion_noticia);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar_noticia", $this->lugar_noticia);
        $stmt->bindParam(":autor", $this->autor);
        $stmt->bindParam(":fecha_publicacion", $this->fecha_publicacion);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->saveImagenPrincipal();
            return true;
        }
        return false;
    }

    // Guardar imagen principal asociada a la noticia
    private function saveImagenPrincipal() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Noticia', :asociado_id, TRUE, :activo)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->titulo;
        $descripcion = $this->resumen;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen_principal));
        $asociado_id = $this->id;   
        $activo = $this->activo;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);
        $stmt->bindParam(":activo", $activo);

        $stmt->execute();
    }

    // Obtener todas las imágenes generales asociadas a la noticia
    public function getImagenesGenerales() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Noticia' AND asociado_id = :asociado_id AND principal = FALSE AND activo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $imagenes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $imagenes[] = $row['ruta_imagen'];
        }
        return $imagenes;
    }

    // Leer todas las noticias
    function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_publicacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
    
        $noticias_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->id = $row['id'];
            $row['imagen_principal'] = $this->getImagenPrincipal();
            $row['imagenes_generales'] = $this->getImagenesGenerales();
            array_push($noticias_arr, $row);
        }
    
        return $noticias_arr;
    }
    
    // Leer una noticia por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($row) {
            $this->titulo = $row['titulo'];
            $this->resumen = $row['resumen'];
            $this->informacion_noticia = $row['informacion_noticia'];
            $this->activo = $row['activo'];
            $this->lugar_noticia = $row['lugar_noticia'];
            $this->autor = $row['autor'];
            $this->fecha_publicacion = $row['fecha_publicacion'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->imagen_principal = $this->getImagenPrincipal();
            return true;
        }
        return false;
    }

    // Actualizar noticia
    function update() {
        $query = "UPDATE " . $this->table_name . " SET 
                  titulo = :titulo, 
                  resumen = :resumen, 
                  informacion_noticia = :informacion_noticia, 
                  activo = :activo, 
                  lugar_noticia = :lugar_noticia, 
                  autor = :autor, 
                  fecha_publicacion = :fecha_publicacion 
                  WHERE id = :id";
    
        $stmt = $this->conn->prepare($query);
    
        // Sanear y vincular los parámetros
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->resumen = htmlspecialchars(strip_tags($this->resumen));
        $this->informacion_noticia = htmlspecialchars(strip_tags($this->informacion_noticia));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar_noticia = htmlspecialchars(strip_tags($this->lugar_noticia));
        $this->autor = htmlspecialchars(strip_tags($this->autor));
        $this->fecha_publicacion = htmlspecialchars(strip_tags($this->fecha_publicacion));
    
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":resumen", $this->resumen);
        $stmt->bindParam(":informacion_noticia", $this->informacion_noticia);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar_noticia", $this->lugar_noticia);
        $stmt->bindParam(":autor", $this->autor);
        $stmt->bindParam(":fecha_publicacion", $this->fecha_publicacion);
        $stmt->bindParam(":id", $this->id);
    
        error_log("Query de actualización: " . $query);
        error_log("Datos a actualizar: " . print_r($this, true));
    
        // Ejecutar la consulta
        if ($stmt->execute()) {
            // Actualizar imagen principal si se proporcionó una nueva
            if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
                $this->updateImagenPrincipal($_FILES['imagen_principal']);
            }
    
            // Actualizar imágenes generales si se proporcionaron nuevas
            if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
                $this->updateImagenesGenerales($_FILES['imagenes_generales']);
            }
    
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
            $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen, activo = :activo 
                      WHERE seccion = 'Noticia' AND asociado_id = :asociado_id AND principal = TRUE";
            $stmt = $this->conn->prepare($query);
            $ruta_relativa = "uploads/noticia/" . basename($target_file);
            $stmt->bindParam(":ruta_imagen", $ruta_relativa);
            $stmt->bindParam(":asociado_id", $this->id);
            $stmt->bindParam(":activo", $this->activo);
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
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Noticia', :asociado_id, FALSE, :activo)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->titulo;
        $descripcion = $this->resumen;
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
    public function deleteImagenGeneral($rutaImagen) {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Noticia' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
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

    // Desactivar noticia y sus imágenes
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

    // Método para activar una noticia y sus imágenes
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
        $query = "UPDATE Imagenes SET activo = false WHERE seccion = 'Noticia' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    private function activarImagenes() {
        $query = "UPDATE Imagenes SET activo = true WHERE seccion = 'Noticia' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    // Eliminar noticia
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

    // Obtener imagen principal asociada a la noticia
    public function getImagenPrincipal() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Noticia' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }

    // Eliminar todas las imágenes asociadas a la noticia
    private function deleteImagenes() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Noticia' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
}
?>
