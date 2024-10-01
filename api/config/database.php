<?php
class Database
{
  private $host = "localhost";
  private $db_name = "UTC";
  private $username = "postgres";
  private $password = "Alexis14";
  private $port = "5433"; // Especifica el puerto aquí
  public $conn;

  public function getConnection()
  {
    $this->conn = null;
    try {
      $this->conn = new PDO("pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name, $this->username, $this->password);
    } catch (PDOException $exception) {
      echo "Connection error: " . $exception->getMessage();
    }
    return $this->conn;
  }
}
