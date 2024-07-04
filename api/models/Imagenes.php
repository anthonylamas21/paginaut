<?php
class Imagenes
{
    private $conn;
    private $table_name = "Imagenes";

    public $id;
    public $titulo;
    public $descripcion;
    public $ruta_imagen;
    public $seccion;
    public $asociado_id;
    public $principal;
    public $fecha_creacion;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                    (titulo, descripcion, ruta_imagen, seccion, asociado_id, principal)
                  VALUES
                    (:titulo, :descripcion, :ruta_imagen, :seccion, :asociado_id, :principal)";
        $stmt = $this->conn->prepare($query);

        $this->titulo = htmlspecialchars(strip_tags($this->titulo));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->ruta_imagen = htmlspecialchars(strip_tags($this->ruta_imagen));
        $this->seccion = htmlspecialchars(strip_tags($this->seccion));
        $this->asociado_id = htmlspecialchars(strip_tags($this->asociado_id));
        $this->principal = filter_var($this->principal, FILTER_VALIDATE_BOOLEAN);

        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":ruta_imagen", $this->ruta_imagen);
        $stmt->bindParam(":seccion", $this->seccion);
        $stmt->bindParam(":asociado_id", $this->asociado_id);
        $stmt->bindParam(":principal", $this->principal, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function read()
    {
        $query = "SELECT
                    id, titulo, descripcion, ruta_imagen, seccion, asociado_id, principal, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
