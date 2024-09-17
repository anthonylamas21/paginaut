<?php
class Visita {
    private $conn;
    private $table_name = "Visita";

    public $id;
    public $ip_address;
    public $fecha_creacion;
    public $hora;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
      $query = "INSERT INTO " . $this->table_name . " 
                  (ip_address)
                VALUES
                  (:ip_address)";
      $stmt = $this->conn->prepare($query);
  
      $this->ip_address = password_hash(htmlspecialchars(strip_tags($this->ip_address)), PASSWORD_DEFAULT);
  
      $stmt->bindParam(":ip_address", $this->ip_address);
  
      if ($stmt->execute()) {
          return true;
      }
  
      return false;
  }

  function findByIpHashed($ipToCheck) {
    $query = "SELECT ip_address FROM " . $this->table_name;
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    // Recuperar todas las IPs de la base de datos
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Usar password_verify para comparar la IP ingresada con los hashes almacenados
        if (password_verify($ipToCheck, $row['ip_address'])) {
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