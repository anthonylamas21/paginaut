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

$root = dirname(__DIR__, 2);

require_once $root . '/api/config/database.php';
require_once $root . '/api/models/BolsaDeTrabajo.php';

$database = new Database();
$db = $database->getConnection();

$bolsa = new BolsaDeTrabajo($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
  case 'POST':
    $isUpdate = isset($_POST['id']);

    if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] == 0) {
      $file_name = basename($_FILES['archivo']['name']);
      $target_dir = $root . '/uploads/bolsa_de_trabajo/';
      $target_file = $target_dir . $file_name;

      if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
      }

      if (move_uploaded_file($_FILES['archivo']['tmp_name'], $target_file)) {
        $bolsa->archivo = '/uploads/bolsa_de_trabajo/' . $file_name;
      } else {
        http_response_code(400);
        echo json_encode(array("message" => "No se pudo subir el archivo."));
        break;
      }
    } elseif ($isUpdate) {
      $bolsa->id = $_POST['id'];
      if ($bolsa->readOne()) {
        // Mantener archivo existente
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
        break;
      }
    } elseif (!$isUpdate) {
      http_response_code(400);
      echo json_encode(array("message" => "Se requiere un archivo para crear una nueva entrada."));
      break;
    }

    $bolsa->nombre_empresa = $_POST['nombre_empresa'];
    $bolsa->descripcion = $_POST['descripcion'];
    $bolsa->activo = isset($_POST['activo']) ? $_POST['activo'] : true;

    if ($isUpdate) {
      $bolsa->id = $_POST['id'];
      if ($bolsa->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Bolsa de trabajo actualizada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo actualizar la bolsa de trabajo."));
      }
    } else {
      if ($bolsa->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Bolsa de trabajo creada correctamente.", "id" => $bolsa->id));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo crear la bolsa de trabajo."));
      }
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $bolsa->id = $_GET['id'];
      if ($bolsa->readOne()) {
        echo json_encode($bolsa);
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
      }
    } else {
      $stmt = $bolsa->read();
      $num = $stmt->rowCount();

      if ($num > 0) {
        $bolsas_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
          $bolsa_item = array(
            "id" => $id,
            "nombre_empresa" => $nombre_empresa,
            "descripcion" => $descripcion,
            "archivo" => $archivo,
            "activo" => $activo,
            "fecha_creacion" => $fecha_creacion
          );
          array_push($bolsas_arr, $bolsa_item);
        }
        echo json_encode(array("records" => $bolsas_arr));
      } else {
        http_response_code(200);
        echo json_encode(array("records" => array()));
      }
    }
    break;

  case 'PUT':
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id) && isset($data->activo)) {
      $bolsa->id = $data->id;
      $bolsa->activo = filter_var($data->activo, FILTER_VALIDATE_BOOLEAN);

      if ($bolsa->updateStatus()) {
        http_response_code(200);
        echo json_encode(array("message" => "Estado de la bolsa de trabajo actualizado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo actualizar el estado de la bolsa de trabajo."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['id'])) {
      $bolsa->id = $_GET['id'];
      if ($bolsa->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Bolsa de trabajo eliminada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar la bolsa de trabajo."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó el ID de la bolsa de trabajo."));
    }
    break;

  default:
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido."));
    break;
}
