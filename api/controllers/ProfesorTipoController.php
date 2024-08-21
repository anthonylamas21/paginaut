<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(dirname(__DIR__) . '/config/database.php');
require_once(dirname(__DIR__) . '/models/ProfesorTipo.php');

$database = new Database();
$db = $database->getConnection();

$profesorTipo = new ProfesorTipo($db);

$request_method = $_SERVER["REQUEST_METHOD"];

// Obtener datos de la solicitud
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
  case 'POST':
    if (!empty($data) && is_array($data)) {
      $success = true;
      foreach ($data as $tipo) {
        if (isset($tipo->profesor_id) && isset($tipo->tipo_id)) {
          $profesorTipo->profesor_id = $tipo->profesor_id;
          $profesorTipo->tipo_id = $tipo->tipo_id;
          if (!$profesorTipo->create()) {
            $success = false;
            break;
          }
        } else {
          http_response_code(400);
          echo json_encode(array("message" => "Datos incompletos en uno de los objetos."));
          exit;
        }
      }
      if ($success) {
        http_response_code(201);
        echo json_encode(array("message" => "Tipos de profesor asignados correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo asignar uno o más tipos de profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos inválidos o vacíos."));
    }
    break;

  case 'GET':
    if (isset($_GET['profesor_id'])) {
      $profesorTipo->profesor_id = $_GET['profesor_id'];
      echo json_encode(array("tipos" => $profesorTipo->getTipos()));
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID de profesor."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['profesor_id'])) {
      $profesorTipo->profesor_id = $_GET['profesor_id'];
      if ($profesorTipo->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Tipos de profesor eliminados correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar los tipos de profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;
}
