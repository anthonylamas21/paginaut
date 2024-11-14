<?php
class Visita {
    private $conn;
    private $table_name = "Visita";

    public $id;
    public $visita_token;
    public $fecha_creacion;
    public $hora;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
      $query = "INSERT INTO " . $this->table_name . " 
                  (visita_token)
                VALUES
                  (:visita_token)";
      $stmt = $this->conn->prepare($query);
  
      $this->visita_token = password_hash(htmlspecialchars(strip_tags($this->visita_token)), PASSWORD_DEFAULT);
  
      $stmt->bindParam(":visita_token", $this->visita_token);
  
      if ($stmt->execute()) {
        return [
          'visita_token' => $this->visita_token
        ];
      }
  
      return false;
  }

  function findByIpHashed($ipToCheck) {
    $query = "SELECT visita_token FROM " . $this->table_name;
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    // Recuperar todas las IPs de la base de datos
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Usar password_verify para comparar la IP ingresada con los hashes almacenados
        if (password_verify($ipToCheck, $row['visita_token'])) {
            return true; // Si se encuentra una coincidencia
        }
    }

    return false; // Si no hay coincidencias
  }

  function read() {
    $query = "SELECT COUNT(*) as total_visitas FROM " . $this->table_name;
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    // Obtener el resultado
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // Retornar el número total de visitas
    return $row['total_visitas'];
}


}