<?php
class BolsaDeTrabajo {
    private $conn;
    private $table_name = "BolsaDeTrabajo";

    public $id;
    public $informacion_oferta;
    public $correo_empresa;
    public $telefono_empresa;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear oferta de trabajo
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (informacion_oferta, correo_empresa, telefono_empresa, activo) 
                VALUES
                (:informacion_oferta, :correo_empresa, :telefono_empresa, :activo)";
        
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->informacion_oferta = htmlspecialchars(strip_tags($this->informacion_oferta));
        $this->correo_empresa = htmlspecialchars(strip_tags($this->correo_empresa));
        $this->telefono_empresa = htmlspecialchars(strip_tags($this->telefono_empresa));
        $this->activo = isset($this->activo) ? $this->activo : true;

        // Vincular los valores
        $stmt->bindParam(":informacion_oferta", $this->informacion_oferta);
        $stmt->bindParam(":correo_empresa", $this->correo_empresa);
        $stmt->bindParam(":telefono_empresa", $this->telefono_empresa);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Leer todas las ofertas de trabajo
    function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Leer una oferta de trabajo por ID
    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->informacion_oferta = $row['informacion_oferta'];
            $this->correo_empresa = $row['correo_empresa'];
            $this->telefono_empresa = $row['telefono_empresa'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }
        return false;
    }

    // Actualizar oferta de trabajo
    function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET 
                informacion_oferta = :informacion_oferta, 
                correo_empresa = :correo_empresa, 
                telefono_empresa = :telefono_empresa, 
                activo = :activo
                WHERE 
                id = :id";
        
        $stmt = $this->conn->prepare($query);

        // Sanear los datos de entrada
        $this->informacion_oferta = htmlspecialchars(strip_tags($this->informacion_oferta));
        $this->correo_empresa = htmlspecialchars(strip_tags($this->correo_empresa));
        $this->telefono_empresa = htmlspecialchars(strip_tags($this->telefono_empresa));
        $this->activo = isset($this->activo) ? $this->activo : true;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Vincular los valores
        $stmt->bindParam(":informacion_oferta", $this->informacion_oferta);
        $stmt->bindParam(":correo_empresa", $this->correo_empresa);
        $stmt->bindParam(":telefono_empresa", $this->telefono_empresa);
        $stmt->bindParam(":activo", $this->activo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar oferta de trabajo
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
}
?>
