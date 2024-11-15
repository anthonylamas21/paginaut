<?php
class Database
{
  private $host = "localhost";
  private $db_name = "UTC"; //
  private $username = "postgres"; // Cambia el usuario según tu configuración de MySQL
  private $password = "2003"; // Cambia la contraseña según tu configuración de MySQL
  private $port = "5432"; // Puerto de MySQL, por defecto es 3306
  public $conn;

  public function getConnection()
  {
    $this->conn = null;
    try {
      $this->conn = new PDO("pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name, $this->username, $this->password);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $exception) {
      echo "Connection error: " . $exception->getMessage();
    }
    return $this->conn;
  }
}
