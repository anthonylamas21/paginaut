<?php
class AuthModel {
    private $conn;
    private $table_name = "token_sesion";

    public function __construct($db) {
        $this->conn = $db;
    }

    function VerifyTokenExist($token) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":token", $token);

        $stmt->execute();

        // Verificar si hay algún resultado
        if ($stmt->rowCount() > 0) {
            return true; // Token válido
        }
        return false; // Token inválido
    }
}
?>
