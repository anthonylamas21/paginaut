<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Configuración de errores y logging
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', 'C:/xampp/htdocs/paginaut/api/logs/php-error.log');

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once $root . '/config/database.php';
require_once $root . '/models/Beca.php';

$database = new Database();
$db = $database->getConnection();

$beca = new Beca($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
  case 'POST':
    // Verificar si es una actualización o una creación
    $isUpdate = isset($_POST['id']);

    // Manejar el archivo si se proporciona uno
    if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] == 0) {
      $file_name = basename($_FILES['archivo']['name']);
      $target_dir = $root . '/uploads/beca/';
      $target_file = $target_dir . $file_name;

      // Verificar si la carpeta de destino existe, si no, crearla
      if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
      }

      if (move_uploaded_file($_FILES['archivo']['tmp_name'], $target_file)) {
        $beca->archivo = '/uploads/beca/' . $file_name; // Guardar la ruta completa
      } else {
        http_response_code(400);
        echo json_encode(array("message" => "No se pudo subir el archivo."));
        break;
      }
    } elseif ($isUpdate) {
      // Si es una actualización y no se proporcionó un nuevo archivo, mantener el archivo existente
      $beca->id = $_POST['id'];
      if ($beca->readOne()) {
        // El método readOne debe haber cargado el archivo existente en $beca->archivo
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Beca no encontrada."));
        break;
      }
    } elseif (!$isUpdate) {
      // Si es una creación y no se proporcionó archivo, error
      http_response_code(400);
      echo json_encode(array("message" => "Se requiere un archivo para crear una nueva beca."));
      break;
    }

    // Asignar valores comunes
    $beca->nombre = $_POST['nombre'];
    $beca->descripcion = $_POST['descripcion'];
    $beca->tipo = $_POST['tipo']; // Nuevo campo para tipo de beca
    $beca->activo = isset($_POST['activo']) ? $_POST['activo'] : true;

    if ($isUpdate) {
      // Actualización
      $beca->id = $_POST['id'];
      if ($beca->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Beca actualizada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo actualizar la beca."));
      }
    } else {
      // Creación
      if ($beca->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Beca creada correctamente.", "id" => $beca->id));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo crear la beca."));
      }
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $beca->id = $_GET['id'];
      if ($beca->readOne()) {
        echo json_encode($beca);
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Beca no encontrada."));
      }
    } else {
      $stmt = $beca->read();
      $num = $stmt->rowCount();

      if ($num > 0) {
        $becas_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
          $beca_item = array(
            "id" => $id,
            "nombre" => $nombre,
            "descripcion" => $descripcion,
            "archivo" => $archivo,
            "tipo" => $tipo, // Nuevo campo para tipo de beca
            "activo" => $activo,
            "fecha_creacion" => $fecha_creacion
          );
          array_push($becas_arr, $beca_item);
        }
        echo json_encode(array("records" => $becas_arr));
      } else {
        http_response_code(200); // Cambiar el código de estado a 200
        echo json_encode(array("records" => array())); // Retornar un arreglo vacío
      }
    }
    break;

  case 'PUT':
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id) && isset($data->activo)) {
      $beca->id = $data->id;
      $beca->activo = filter_var($data->activo, FILTER_VALIDATE_BOOLEAN);

      if ($beca->updateStatus()) {
        http_response_code(200);
        echo json_encode(array("message" => "Estado de la beca actualizado correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo actualizar el estado de la beca."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['id'])) {
      $beca->id = $_GET['id'];
      if ($beca->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Beca eliminada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar la beca."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó el ID de la beca."));
    }
    break;

  default:
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido."));
    break;
}
