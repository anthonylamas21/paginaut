<?php
class Evento {
    private $conn;
    private $table_name = "Evento";

    public $id;
    public $titulo;
    public $informacion_evento;
    public $activo;
    public $lugar_evento;
    public $fecha_inicio;
    public $fecha_fin;
    public $hora_inicio;
    public $hora_fin;
    public $fecha_creacion;
    public $imagen_principal;
    public $imagenes_generales = [];
    public $archivos = [];

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear evento
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (titulo, informacion_evento, activo, lugar_evento, fecha_inicio, fecha_fin, hora_inicio, hora_fin) 
                  VALUES 
                  (:titulo, :informacion_evento, :activo, :lugar_evento, :fecha_inicio, :fecha_fin, :hora_inicio, :hora_fin)";
        
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar_evento = htmlspecialchars(strip_tags($this->lugar_evento));
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));

        // Vincular parámetros
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar_evento", $this->lugar_evento);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            if (!empty($_FILES['imagen_principal'])) {
                $this->saveImagenPrincipal($_FILES['imagen_principal']);
            }
            $this->saveImagenesGenerales();
            $this->saveArchivos();
            return true;
        }
        return false;
    }

    // Guardar imagen principal asociada al evento
    private function saveImagenPrincipal() {
        if (!empty($this->imagen_principal)) {
            $target_dir = "../uploads/evento/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $target_file = $target_dir . uniqid() . "_" . basename($this->imagen_principal["name"]);
            if (move_uploaded_file($this->imagen_principal["tmp_name"], $target_file)) {
                $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                          VALUES (:titulo, :descripcion, :ruta_imagen, 'Evento', :asociado_id, TRUE, :activo)";
                $stmt = $this->conn->prepare($query);

                $titulo = $this->titulo;
                $descripcion = $this->informacion_evento;
                $ruta_imagen = htmlspecialchars(strip_tags("uploads/evento/" . basename($target_file)));
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

    // Guardar imágenes generales asociadas al evento
    private function saveImagenesGenerales() {
        if (!empty($this->imagenes_generales)) {
            $target_dir = "../uploads/evento/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                      VALUES (:titulo, :descripcion, :ruta_imagen, 'Evento', :asociado_id, FALSE, :activo)";
            $stmt = $this->conn->prepare($query);

            foreach ($this->imagenes_generales['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($this->imagenes_generales["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $titulo = $this->titulo;
                        $descripcion = $this->informacion_evento;
                        $ruta_imagen = htmlspecialchars(strip_tags("uploads/evento/" . basename($target_file)));
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
    }

    // Guardar archivos asociados al evento
    private function saveArchivos() {
        if (!empty($this->archivos)) {
            $target_dir = "../uploads/evento/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id, activo)
                      VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Evento', :asociado_id, :activo)";
            $stmt = $this->conn->prepare($query);

            foreach ($this->archivos['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($this->archivos["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $nombre_archivo = htmlspecialchars(strip_tags($this->archivos["name"][$key]));
                        $ruta_archivo = htmlspecialchars(strip_tags("uploads/evento/" . basename($target_file)));
                        $tipo_archivo = htmlspecialchars(strip_tags($this->archivos["type"][$key]));
                        $asociado_id = $this->id;
                        $activo = $this->activo;

                        $stmt->bindParam(":nombre_archivo", $nombre_archivo);
                        $stmt->bindParam(":ruta_archivo", $ruta_archivo);
                        $stmt->bindParam(":tipo_archivo", $tipo_archivo);
                        $stmt->bindParam(":asociado_id", $asociado_id);
                        $stmt->bindParam(":activo", $activo);

                        $stmt->execute();
                    }
                }
            }
        }
    }

    // Obtener todas las imágenes generales asociadas al evento
    public function getImagenesGenerales() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND principal = FALSE AND activo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $imagenes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $imagenes[] = $row['ruta_imagen'];
        }
        return $imagenes;
    }

    // Obtener todos los archivos asociados al evento
    public function getArchivos() {
        $query = "SELECT ruta_archivo, nombre_archivo, tipo_archivo FROM Archivos WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND activo = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $archivos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $archivos[] = $row;
        }
        return $archivos;
    }

    // Leer todos los eventos
    function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
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

    // Leer un evento por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($row) {
            $this->titulo = $row['titulo'];
            $this->informacion_evento = $row['informacion_evento'];
            $this->activo = $row['activo'];
            $this->lugar_evento = $row['lugar_evento'];
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

    // Actualizar evento
    function update() {
                $query = "UPDATE " . $this->table_name . " SET 
                titulo = :titulo, 
                informacion_evento = :informacion_evento, 
                activo = :activo, 
                lugar_evento = :lugar_evento, 
                fecha_inicio = :fecha_inicio, 
                fecha_fin = :fecha_fin, 
                hora_inicio = :hora_inicio, 
                hora_fin = :hora_fin 
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);
    
        // Sanear y vincular los parámetros
        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->informacion_evento = htmlspecialchars(strip_tags($this->informacion_evento));
        $this->activo = $this->activo ? 1 : 0;
        $this->lugar_evento = htmlspecialchars(strip_tags($this->lugar_evento));
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_fin = htmlspecialchars(strip_tags($this->hora_fin));
    
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":informacion_evento", $this->informacion_evento);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":lugar_evento", $this->lugar_evento);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_fin", $this->hora_fin);
        $stmt->bindParam(":id", $this->id);
    
        if ($stmt->execute()) {
            // Actualizar imagen principal si se proporcionó una nueva
            if (!empty($_FILES['imagen_principal'])) {
                $this->updateImagenPrincipal($_FILES['imagen_principal']);
            }
    
            // Actualizar imágenes generales si se proporcionaron nuevas
            if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
                $this->updateImagenesGenerales($_FILES['imagenes_generales']);
            }
    
            // Actualizar archivos si se proporcionaron nuevos
            if (isset($_FILES['archivos']) && !empty($_FILES['archivos']['name'][0])) {
                $this->updateArchivos($_FILES['archivos']);
            }
    
            return true;
        } else {
            return false;
        }
    }

    public function updateImagenPrincipal($imagen) {
        $target_dir = "../uploads/evento/";
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
    
            $ruta_relativa = "uploads/evento/" . basename($target_file);
    
            // Primero, intentamos actualizar la imagen existente
            $query = "UPDATE Imagenes SET ruta_imagen = :ruta_imagen, activo = :activo 
                      WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND principal = TRUE";
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
                          VALUES (:titulo, :descripcion, :ruta_imagen, 'Evento', :asociado_id, TRUE, :activo)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":titulo", $this->titulo);
                $stmt->bindParam(":descripcion", $this->informacion_evento);
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

    public function updateImagenesGenerales($nuevasImagenes) {
        if ($nuevasImagenes && is_array($nuevasImagenes['tmp_name'])) {
            $target_dir = "../uploads/evento/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }
    
            $nuevasRutas = [];
    
            foreach ($nuevasImagenes['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($nuevasImagenes["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $nuevasRutas[] = "uploads/evento/" . basename($target_file);
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
    
    public function updateArchivos($nuevosArchivos) {
        if ($nuevosArchivos && is_array($nuevosArchivos['tmp_name'])) {
            $target_dir = "../uploads/evento/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true);
            }
    
            $nuevasRutas = [];
    
            foreach ($nuevosArchivos['tmp_name'] as $key => $tmp_name) {
                if (!empty($tmp_name)) {
                    $target_file = $target_dir . uniqid() . "_" . basename($nuevosArchivos["name"][$key]);
                    if (move_uploaded_file($tmp_name, $target_file)) {
                        $nuevasRutas[] = [
                            'ruta_archivo' => "uploads/evento/" . basename($target_file),
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
    public function saveImagenGeneral($ruta_imagen) {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, activo)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Evento', :asociado_id, FALSE, :activo)";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->titulo;
        $descripcion = $this->informacion_evento;
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
    public function saveArchivo($archivo) {
        $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id, activo)
                  VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'Evento', :asociado_id, :activo)";
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

    // Método auxiliar para eliminar una imagen general de la base de datos
    public function deleteImagenGeneral($rutaImagen) {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND ruta_imagen = :ruta_imagen AND principal = FALSE";
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

    // Método auxiliar para eliminar un archivo de la base de datos
    public function deleteArchivo($rutaArchivo) {
        $query = "DELETE FROM Archivos WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND ruta_archivo = :ruta_archivo";
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
    public function desactivar() {
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
    public function activar() {
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

    private function desactivarImagenes() {
        $query = "UPDATE Imagenes SET activo = false WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    private function activarImagenes() {
        $query = "UPDATE Imagenes SET activo = true WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    private function desactivarArchivos() {
        $query = "UPDATE Archivos SET activo = false WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    private function activarArchivos() {
        $query = "UPDATE Archivos SET activo = true WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':asociado_id', $this->id);
        $stmt->execute();
    }

    // Eliminar evento
    function delete() {
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

    // Obtener imagen principal asociada al evento
    public function getImagenPrincipal() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }

    // Eliminar todas las imágenes asociadas al evento
    private function deleteImagenes() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }

    // Eliminar todos los archivos asociados al evento
    private function deleteArchivos() {
        $query = "DELETE FROM Archivos WHERE seccion = 'Evento' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
    public function readRecent($limit = 5) {
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
?>
