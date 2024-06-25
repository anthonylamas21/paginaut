<?php
class Departamento {
    // Conexión a la base de datos y nombre de la tabla
    private $conn;
    private $table_name = "Departamento";

    // Propiedades del objeto
    public $id;
    public $nombre;
    public $activo;
    public $fecha_creacion;

    // Constructor con $db como conexión a la base de datos
    public function __construct($db) {
        $this->conn = $db;
    }

    // Método para crear un nuevo departamento
    function create() {
      $query = "INSERT INTO " . $this->table_name . "
                  (nombre, activo)
                VALUES
                  (:nombre, :activo)";
      $stmt = $this->conn->prepare($query);
  
      $this->nombre = htmlspecialchars(strip_tags($this->nombre));
      $this->activo = true; // Establecer $this->activo a true
  
      $stmt->bindParam(":nombre", $this->nombre);
      $stmt->bindParam(":activo", $this->activo);
  
      if ($stmt->execute()) {
          return true;
      }
  
      return false;
  }

    // Método para leer todos los departamentos
    function read() {
        // Consulta para leer todos los departamentos
        $query = "SELECT
                    id, nombre, activo, fecha_creacion
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    fecha_creacion DESC";

        // Preparar la consulta
        $stmt = $this->conn->prepare($query);

        // Ejecutar la consulta
        $stmt->execute();

        return $stmt;
    }

    // Método para actualizar un departamento
    function update() {
        // Consulta de actualización
        $query = "UPDATE " . $this->table_name . "
                  SET
                    nombre = :nombre,
                    activo = :activo
                  WHERE
                    id = :id";

        // Preparar la consulta
        $stmt = $this->conn->prepare($query);

        // Sanitizar las entradas
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->activo = htmlspecialchars(strip_tags($this->activo));

        // Enlazar los parámetros
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":activo", $this->activo);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para eliminar un departamento
    function delete() {
        // Consulta de eliminación
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // Preparar la consulta
        $stmt = $this->conn->prepare($query);

        // Sanitizar las entradas
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Enlazar el parámetro
        $stmt->bindParam(1, $this->id);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>
