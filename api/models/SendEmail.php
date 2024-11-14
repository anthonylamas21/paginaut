<?php
class Usuario {
    private $conn;
    private $table_name = "Usuario";

    public $correo;
    public $token_recuperacion;
    public $contrasena;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function index() {
        $query = "SELECT correo, token_recuperacion FROM " . $this->table_name . " WHERE correo = :correo";
        
        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->execute();

        // Obtener la fila
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            // Asignar valores a las propiedades del objeto
            $this->correo = $row['correo'];
            $this->token_recuperacion = $row['token_recuperacion'];
            return true;
        } else {
            return false;
        }
    }

     // Método para verificar si el correo electrónico existe
     public function store() {
        $query = "SELECT correo FROM " . $this->table_name . " WHERE correo = :correo LIMIT 1 OFFSET 0";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->execute();
        
        // Verificar si se encontró el correo electrónico
        if($stmt->rowCount() > 0) {
            return true; 
        } else {
            return false; 
        }
    }

    function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET token_recuperacion = :token_recuperacion WHERE correo = :correo";
        $stmt = $this->conn->prepare($query);

        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->token_recuperacion = htmlspecialchars(strip_tags($this->token_recuperacion));

        $stmt->bindParam(":correo", $this->correo);
        $stmt->bindParam(":token_recuperacion", $this->token_recuperacion);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function updatePassword() {
        $query = "UPDATE " . $this->table_name . " 
                  SET contrasena = :contrasena WHERE correo = :correo";
        $stmt = $this->conn->prepare($query);

        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->contrasena = password_hash(htmlspecialchars(strip_tags($this->contrasena)), PASSWORD_DEFAULT);

        $stmt->bindParam(":correo", $this->correo);
        $stmt->bindParam(":contrasena", $this->contrasena);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function verifyCode(){
        $query = "SELECT token_recuperacion FROM " . $this->table_name . " WHERE token_recuperacion = :token_recuperacion LIMIT 1 OFFSET 0";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token_recuperacion', $this->token_recuperacion);
        $stmt->execute();
        
        // Verificar si se encontró el token de recuperacion
        if($stmt->rowCount() > 0) {
            return true; 
        } else {
            return false; 
        }
    }
}