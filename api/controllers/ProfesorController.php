<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(dirname(__DIR__) . '/config/database.php');
require_once(dirname(__DIR__) . '/models/Profesor.php');

$database = new Database();
$db = $database->getConnection();

$profesor = new Profesor($db);

$request_method = $_SERVER["REQUEST_METHOD"];

// Obtener datos de la solicitud
switch ($request_method) {
  case 'POST':
    $data = $_POST;
    if (!empty($data['nombre']) && !empty($data['apellido']) && !empty($data['correo'])) {
      $profesor->nombre = $data['nombre'];
      $profesor->apellido = $data['apellido'];
      $profesor->correo = $data['correo'];
      $profesor->telefono = $data['telefono'] ?? null;
      $profesor->especialidad = $data['especialidad'] ?? null;
      $profesor->grado_academico = $data['grado_academico'] ?? null;
      $profesor->experiencia = $data['experiencia'] ?? null;
      $profesor->foto = isset($_FILES['foto']) ? file_get_contents($_FILES['foto']['tmp_name']) : null;
      $profesor->activo = isset($data['activo']) ? filter_var($data['activo'], FILTER_VALIDATE_BOOLEAN) : true;

      if ($profesor->create()) {
        $profesor_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode(array("message" => "Profesor creado correctamente.", "id" => $profesor_id));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo crear el profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $profesor->id = $_GET['id'];
      if ($profesor->readOne()) {
        echo json_encode($profesor->getDetalles());
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Profesor no encontrado."));
      }
    } else {
      echo json_encode(array("records" => $profesor->read()));
    }
    break;

  case 'PUT':
    parse_str(file_get_contents("php://input"), $data);
    if (isset($data['id'])) {
      $profesor->id = $data['id'];
      if ($profesor->readOne()) {
        $profesor->nombre = !empty($data['nombre']) ? $data['nombre'] : $profesor->nombre;
        $profesor->apellido = !empty($data['apellido']) ? $data['apellido'] : $profesor->apellido;
        $profesor->correo = !empty($data['correo']) ? $data['correo'] : $profesor->correo;
        $profesor->telefono = !empty($data['telefono']) ? $data['telefono'] : $profesor->telefono;
        $profesor->especialidad = !empty($data['especialidad']) ? $data['especialidad'] : $profesor->especialidad;
        $profesor->grado_academico = !empty($data['grado_academico']) ? $data['grado_academico'] : $profesor->grado_academico;
        $profesor->experiencia = !empty($data['experiencia']) ? $data['experiencia'] : $profesor->experiencia;
        $profesor->foto = isset($_FILES['foto']) ? file_get_contents($_FILES['foto']['tmp_name']) : $profesor->foto;
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
