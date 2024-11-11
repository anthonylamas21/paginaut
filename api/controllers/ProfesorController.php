<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', 'C:/xampp/htdocs/paginaut/api/logs/php-error.log');

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Profesor.php';

$database = new Database();
$db = $database->getConnection();

$profesor = new Profesor($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
  case 'POST':
    $data = $_POST;
    $isUpdate = isset($_POST['id']);

    if ($isUpdate) {
      $profesor->id = $_POST['id'];
      if (!$profesor->readOne()) {
        http_response_code(404);
        echo json_encode(array("message" => "Profesor no encontrado."));
        break;
      }

      // Si solo estás actualizando el estado "activo"
      if (isset($data['activo']) && count($data) == 2) { // Incluye 'id' y 'activo'
        $profesor->activo = filter_var($data['activo'], FILTER_VALIDATE_BOOLEAN);
        if ($profesor->update()) {
          http_response_code(200);
          echo json_encode(array("message" => "Estado del profesor actualizado correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo actualizar el estado del profesor."));
        }
        break;
      }
    }

    // Lógica existente para manejar la actualización o creación completa de un profesor
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
      $file_name = basename($_FILES['foto']['name']);
      $target_dir = $root . '/uploads/profesores/';
      $target_file = $target_dir . $file_name;

      if (!is_dir($target_dir)) {
          mkdir($target_dir, 0777, true);
      }

      if (move_uploaded_file($_FILES['foto']['tmp_name'], $target_file)) {
          $profesor->foto = '/uploads/profesores/' . $file_name;
      } else {
          http_response_code(400);
          echo json_encode(array("message" => "No se pudo subir la foto."));
          break;
      }
  } elseif ($isUpdate) {
      $profesor->id = $_POST['id'];
      if ($profesor->readOne()) {
          $profesor->foto = $profesor->foto;  // Mantén la foto existente
      }
  }

    $profesor->nombre = $data['nombre'];
    $profesor->apellido = $data['apellido'];
    $profesor->correo = $data['correo'];
    $profesor->telefono = $data['telefono'] ?? null;
    $profesor->especialidad = $data['especialidad'] ?? null;
    $profesor->grado_academico = $data['grado_academico'] ?? null;
    $profesor->experiencia = $data['experiencia'] ?? null;
    $profesor->activo = isset($data['activo']) ? filter_var($data['activo'], FILTER_VALIDATE_BOOLEAN) : true;

    if ($isUpdate) {
      if ($profesor->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Profesor actualizado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo actualizar el profesor."));
      }
    } else {
      if ($profesor->create()) {
        $profesor_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode(array("message" => "Profesor creado correctamente.", "id" => $profesor_id));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo crear el profesor."));
      }
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $profesor->id = $_GET['id'];
      if ($profesor->readOne()) {
        // Obtener los tipos de profesor
        require_once $root . '/api/models/ProfesorTipo.php';
        $profesorTipo = new ProfesorTipo($db);
        $profesorTipo->profesor_id = $profesor->id;
        $tipos = $profesorTipo->getTipos();

        // Incluir los tipos en la respuesta
        $detalles = $profesor->getDetalles();
        $detalles['tipos'] = array_column($tipos, 'tipo_id');

        echo json_encode($detalles);
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Profesor no encontrado."));
      }
    }elseif(isset($_GET['accion']) && $_GET['accion'] === 'getprofesores'){
      echo json_encode(array("records" => $profesor->readProfesores()));
      
    } else {
      echo json_encode(array("records" => $profesor->read()));
    }
    break;

  case 'PUT':
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (is_array($data) && isset($data['id'])) {
      $profesor->id = $data['id'];

      if ($profesor->readOne()) {
        $profesor->nombre = $data['nombre'] ?? $profesor->nombre;
        $profesor->apellido = $data['apellido'] ?? $profesor->apellido;
        $profesor->correo = $data['correo'] ?? $profesor->correo;
        $profesor->telefono = $data['telefono'] ?? $profesor->telefono;
        $profesor->especialidad = $data['especialidad'] ?? $profesor->especialidad;
        $profesor->grado_academico = $data['grado_academico'] ?? $profesor->grado_academico;
        $profesor->experiencia = $data['experiencia'] ?? $profesor->experiencia;
        $profesor->foto = $data['foto'] ?? $profesor->foto;
        $profesor->activo = isset($data['activo']) ? filter_var($data['activo'], FILTER_VALIDATE_BOOLEAN) : $profesor->activo;

        if ($profesor->update()) {
          http_response_code(200);
          echo json_encode(array("message" => "Profesor actualizado correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo actualizar el profesor."));
        }
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Profesor no encontrado."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['id'])) {
      $profesor->id = $_GET['id'];
      if ($profesor->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Profesor eliminado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar el profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;
}
