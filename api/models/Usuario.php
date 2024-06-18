<?php
class Usuario {
    private $conn;
    private $table_name = "Usuario";

    public $id;
    public $correo;
    public $contrasena;
    public $rol_id;
    public $departamento_id;
    public $token_recuperacion;
    public $fecha_expiracion_token;
    public $activo;
    public $fecha_creacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                    (correo, contrasena, rol_id, departamento_id, token_recuperacion, fecha_expiracion_token, activo) 
                  VALUES 
                    (:correo, :contrasena, :rol_id, :departamento_id, :token_recuperacion, :fecha_expiracion_token, :activo)";
        $stmt = $this->conn->prepare($query);

        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->contrasena = password_hash(htmlspecialchars(strip_tags($this->contrasena)), PASSWORD_DEFAULT);
        $this->rol_id = htmlspecialchars(strip_tags($this->rol_id));
        $this->departamento_id = htmlspecialchars(strip_tags($this->departamento_id));
        $this->token_recuperacion = htmlspecialchars(strip_tags($this->token_recuperacion));
        $this->fecha_expiracion_token = htmlspecialchars(strip_tags($this->fecha_expiracion_token));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        $stmt->bindParam(":correo", $this->correo);
        $stmt->bindParam(":contrasena", $this->contrasena);
        $stmt->bindParam(":rol_id", $this->rol_id);
        $stmt->bindParam(":departamento_id", $this->departamento_id);
        $stmt->bindParam(":token_recuperacion", $this->token_recuperacion);
        $stmt->bindParam(":fecha_expiracion_token", $this->fecha_expiracion_token);
        $stmt->bindParam(":activo", $this->activo);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->correo = $row['correo'];
            $this->rol_id = $row['rol_id'];
            $this->departamento_id = $row['departamento_id'];
            $this->token_recuperacion = $row['token_recuperacion'];
            $this->fecha_expiracion_token = $row['fecha_expiracion_token'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
        }
    }

    function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET 
                    correo = :correo, 
                    rol_id = :rol_id, 
                    departamento_id = :departamento_id, 
                    token_recuperacion = :token_recuperacion, 
                    fecha_expiracion_token = :fecha_expiracion_token, 
                    activo = :activo 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->rol_id = htmlspecialchars(strip_tags($this->rol_id));
        $this->departamento_id = htmlspecialchars(strip_tags($this->departamento_id));
        $this->token_recuperacion = htmlspecialchars(strip_tags($this->token_recuperacion));
        $this->fecha_expiracion_token = htmlspecialchars(strip_tags($this->fecha_expiracion_token));
        $this->activo = htmlspecialchars(strip_tags($this->activo));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":correo", $this->correo);
        $stmt->bindParam(":rol_id", $this->rol_id);
        $stmt->bindParam(":departamento_id", $this->departamento_id);
        $stmt->bindParam(":token_recuperacion", $this->token_recuperacion);
        $stmt->bindParam(":fecha_expiracion_token", $this->fecha_expiracion_token);
        $stmt->bindParam(":activo", $this->activo);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
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

    function login($correo, $contrasena) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE correo = :correo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":correo", $correo);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($row && password_verify($contrasena, $row['contrasena'])) {
            $this->id = $row['id'];
            $this->correo = $row['correo'];
            $this->rol_id = $row['rol_id'];
            $this->departamento_id = $row['departamento_id'];
            $this->token_recuperacion = $row['token_recuperacion'];
            $this->fecha_expiracion_token = $row['fecha_expiracion_token'];
            $this->activo = $row['activo'];
            $this->fecha_creacion = $row['fecha_creacion'];
            return true;
        }
    
        return false;
    }
    function generateRecoveryToken() {
        $token = bin2hex(random_bytes(16));
        $this->token_recuperacion = $token;
        $this->fecha_expiracion_token = date('Y-m-d H:i:s', strtotime('+1 day')); // Token válido por 1 día
        return $token;
    }
}
?>
