<?php
class Carrera {
    private $conn;
    private $table_name = "Carrera";

    public $id;
    public $nombre_carrera;
    public $perfil_profesional;
    public $ocupacion_profesional;
    public $imagen_carrera;
    public $direccion_id;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                    (nombre_carrera, perfil_profesional, ocupacion_profesional, direccion_id, activo)
                  VALUES
                    (:nombre_carrera, :perfil_profesional, :ocupacion_profesional, :direccion_id, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
        $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
        $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
        $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));
        $this->activo = true; // Establecer $this->activo a true

        $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
        $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
        $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
        $stmt->bindParam(":direccion_id", $this->direccion_id);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->saveImagenCarrera();
            return true;
        }

        return false;
    }

    function read() {
        $query = "SELECT
                    id, nombre_carrera, perfil_profesional, ocupacion_profesional, direccion_id, activo, fecha_creacion
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
                    id, nombre_carrera, perfil_profesional, ocupacion_profesional, direccion_id, activo, fecha_creacion
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
            $this->nombre_carrera = $row['nombre_carrera'];
            $this->perfil_profesional = $row['perfil_profesional'];
            $this->ocupacion_profesional = $row['ocupacion_profesional'];
            $this->direccion_id = $row['direccion_id'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            $this->imagen_carrera = $this->getImagenCarrera();
            return true;
        }

        return false;
    }

    function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    nombre_carrera = :nombre_carrera,
                    perfil_profesional = :perfil_profesional,
                    ocupacion_profesional = :ocupacion_profesional,
                    direccion_id = :direccion_id,
                    activo = :activo
                  WHERE
                    id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre_carrera = htmlspecialchars(strip_tags($this->nombre_carrera));
        $this->perfil_profesional = htmlspecialchars(strip_tags($this->perfil_profesional));
        $this->ocupacion_profesional = htmlspecialchars(strip_tags($this->ocupacion_profesional));
        $this->direccion_id = htmlspecialchars(strip_tags($this->direccion_id));

        // Convertir el campo 'activo' a tipo de dato booleano
        $this->activo = filter_var($this->activo, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nombre_carrera", $this->nombre_carrera);
        $stmt->bindParam(":perfil_profesional", $this->perfil_profesional);
        $stmt->bindParam(":ocupacion_profesional", $this->ocupacion_profesional);
        $stmt->bindParam(":direccion_id", $this->direccion_id);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL); // Asegurar que se trate como un booleano

        if ($stmt->execute()) {
            $this->saveImagenCarrera();
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
            return true;
        }

        return false;
    }

    private function saveImagenCarrera() {
        $query = "INSERT INTO Imagenes (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES (:titulo, :descripcion, :ruta_imagen, 'Carrera', :asociado_id, TRUE)
                  ON CONFLICT (seccion, asociado_id) DO UPDATE
                  SET ruta_imagen = EXCLUDED.ruta_imagen";
        $stmt = $this->conn->prepare($query);

        $titulo = $this->nombre_carrera;
        $descripcion = $this->perfil_profesional;
        $ruta_imagen = htmlspecialchars(strip_tags($this->imagen_carrera));
        $asociado_id = $this->id;

        $stmt->bindParam(":titulo", $titulo);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":ruta_imagen", $ruta_imagen);
        $stmt->bindParam(":asociado_id", $asociado_id);

        $stmt->execute();
    }

    public function getImagenCarrera() {
        $query = "SELECT ruta_imagen FROM Imagenes WHERE seccion = 'Carrera' AND asociado_id = :asociado_id AND principal = TRUE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":asociado_id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['ruta_imagen'] : null;
    }
}
?>