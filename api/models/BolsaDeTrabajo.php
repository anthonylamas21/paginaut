<?php
class BolsaDeTrabajo {
    private $conn;
    private $table_name = "BolsaDeTrabajo";

    public $id;
    public $titulo_trabajo;
    public $informacion_oferta;
    public $correo_empresa;
    public $tipo;
    public $telefono_empresa;
    public $imagen;
    public $activo;
    public $id_direccion;
    public $fecha_creacion;
    public $archivo_asociado;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                    (titulo_trabajo, informacion_oferta, correo_empresa, tipo, telefono_empresa, activo, id_direccion)
                  VALUES
                    (:titulo_trabajo, :informacion_oferta, :correo_empresa, :tipo, :telefono_empresa, :activo, :id_direccion)";
        $stmt = $this->conn->prepare($query);

        $this->titulo_trabajo = htmlspecialchars(strip_tags($this->titulo_trabajo));
        $this->informacion_oferta = htmlspecialchars(strip_tags($this->informacion_oferta));
        $this->correo_empresa = htmlspecialchars(strip_tags($this->correo_empresa));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->telefono_empresa = htmlspecialchars(strip_tags($this->telefono_empresa));
        $this->activo = true; // Establecer $this->activo a true

        $stmt->bindParam(":titulo_trabajo", $this->titulo_trabajo);
        $stmt->bindParam(":informacion_oferta", $this->informacion_oferta);
        $stmt->bindParam(":correo_empresa", $this->correo_empresa);
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":telefono_empresa", $this->telefono_empresa);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id_direccion", $this->id_direccion);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->saveImagenBolsaDeTrabajo();
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoBolsaDeTrabajo();
            }
            return true;
        }

        return false;
    }

    function read() {
        $query = "SELECT
                    id, titulo_trabajo, informacion_oferta, correo_empresa, tipo, telefono_empresa, activo, id_direccion, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne() {
        $query = "SELECT
                    id, titulo_trabajo, informacion_oferta, correo_empresa, tipo, telefono_empresa, activo, id_direccion, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  WHERE
                    id = ?
                  LIMIT
                    0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->titulo_trabajo = $row['titulo_trabajo'];
            $this->informacion_oferta = $row['informacion_oferta'];
            $this->correo_empresa = $row['correo_empresa'];
            $this->tipo = $row['tipo'];
            $this->telefono_empresa = $row['telefono_empresa'];
            $this->activo = $row['activo'];
            $this->id_direccion = $row['id_direccion'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->imagen = $this->getImagenBolsaDeTrabajo();
            $this->archivo_asociado = $this->getArchivoBolsaDeTrabajo();
            return true;
        }

        return false;
    }

    function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    titulo_trabajo = :titulo_trabajo,
                    informacion_oferta = :informacion_oferta,
                    correo_empresa = :correo_empresa,
                    tipo = :tipo,
                    telefono_empresa = :telefono_empresa,
                    activo = :activo,
                    id_direccion = :id_direccion
                  WHERE
                    id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->titulo_trabajo = htmlspecialchars(strip_tags($this->titulo_trabajo));
        $this->informacion_oferta = htmlspecialchars(strip_tags($this->informacion_oferta));
        $this->correo_empresa = htmlspecialchars(strip_tags($this->correo_empresa));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->telefono_empresa = htmlspecialchars(strip_tags($this->telefono_empresa));
        $this->activo = htmlspecialchars(strip_tags($this->activo));
        $this->id_direccion = htmlspecialchars(strip_tags($this->id_direccion));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":titulo_trabajo", $this->titulo_trabajo);
        $stmt->bindParam(":informacion_oferta", $this->informacion_oferta);
        $stmt->bindParam(":correo_empresa", $this->correo_empresa);
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":telefono_empresa", $this->telefono_empresa);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id_direccion", $this->id_direccion);

        if ($stmt->execute()) {
            $this->saveImagenBolsaDeTrabajo();
            if (!empty($this->archivo_asociado)) {
                $this->saveArchivoBolsaDeTrabajo();
            }
            return true;
        }

        return false;
    }

    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            $this->deleteImagenBolsaDeTrabajo();
            $this->deleteArchivoBolsaDeTrabajo();
            return true;
        }

        return false;
    }

    private function saveImagenBolsaDeTrabajo() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'BolsaDeTrabajo', :asociado_id, TRUE)
                  ON CONFLICT (seccion, asociado_id) DO UPDATE
                  SET ruta_imagen = EXCLUDED.ruta_imagen";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->titulo_trabajo;
        $descripcion = $this->informacion_oferta;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen));
        $asociado_id = $this->id;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    public function getImagenBolsaDeTrabajo() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'BolsaDeTrabajo' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }

    private function deleteImagenBolsaDeTrabajo() {
        $query = "DELETE FROM Imagenes WHERE seccion = 'BolsaDeTrabajo' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }

    private function saveArchivoBolsaDeTrabajo() {
        $query = "INSERT INTO Archivos (nombre_archivo, ruta_archivo, tipo_archivo, seccion, asociado_id)
                  VALUES (:nombre_archivo, :ruta_archivo, :tipo_archivo, 'BolsaDeTrabajo', :asociado_id)
                  ON CONFLICT (seccion, asociado_id) DO UPDATE
                  SET nombre_archivo = EXCLUDED.nombre_archivo, ruta_archivo = EXCLUDED.ruta_archivo, tipo_archivo = EXCLUDED.tipo_archivo";
        $stmt = $this->conn->prepare($query);

        $nombre_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['nombre_archivo']));
        $ruta_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['ruta_archivo']));
        $tipo_archivo = htmlspecialchars(strip_tags($this->archivo_asociado['tipo_archivo']));
        $asociado_id = $this->id;

        $stmt->bindParam(":nombre_archivo", $nombre_archivo);
        $stmt->bindParam(":ruta_archivo", $ruta_archivo);
        $stmt->bindParam(":tipo_archivo", $tipo_archivo);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    public function getArchivoBolsaDeTrabajo() {
        $query = "SELECT nombre_archivo, ruta_archivo, tipo_archivo FROM Archivos WHERE seccion = 'BolsaDeTrabajo' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row : null;
    }

    private function deleteArchivoBolsaDeTrabajo() {
        $query = "DELETE FROM Archivos WHERE seccion = 'BolsaDeTrabajo' AND asociado_id = :asociado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
    }
}
?>
