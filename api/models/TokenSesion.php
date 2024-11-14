<?php
class TokenSesion {
    private $conn;
    private $table_name = "token_sesion";

    public $token;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear taller
    function BuscarToken() {
        $query = "SELECT * FROM " . $this->table_name ." WHERE token = :token";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":token", $this->token);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
