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
    if (!empty($data->profesor_id) && !empty($data->tipo_id)) {
      $profesorTipo->profesor_id = $data->profesor_id;
      $profesorTipo->tipo_id = $data->tipo_id;

      if ($profesorTipo->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Tipo de profesor asignado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo asignar el tipo de profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
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
    if (isset($_GET['id'])) {
      $profesorTipo->id = $_GET['id'];
      if ($profesorTipo->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Tipo de profesor eliminado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar el tipo de profesor."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;
}
