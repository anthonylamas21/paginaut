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

$root = dirname(__DIR__, 2);  // Obtiene el directorio raíz del proyecto

require_once $root . '/api/config/database.php';
require_once $root . '/api/models/Calendario.php';

$database = new Database();
$db = $database->getConnection();

$calendario = new Calendario($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        // Verificar si es una actualización o una creación
        $isUpdate = isset($_POST['id']);

        // Manejar el archivo si se proporciona uno
        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] == 0) {
            $file_name = basename($_FILES['archivo']['name']);
            $target_dir = $root . '/uploads/calendario/';
            $target_file = $target_dir . $file_name;

            if (move_uploaded_file($_FILES['archivo']['tmp_name'], $target_file)) {
                $calendario->archivo = '/uploads/calendario/' . $file_name; // Guardar la ruta completa
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "No se pudo subir el archivo."));
                break;
            }
        } elseif ($isUpdate) {
            // Si es una actualización y no se proporcionó un nuevo archivo, mantener el archivo existente
            $calendario->id = $_POST['id'];
            if ($calendario->readOne()) {
                // El método readOne debe haber cargado el archivo existente en $calendario->archivo
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Calendario no encontrado."));
                break;
            }
        } elseif (!$isUpdate) {
            // Si es una creación y no se proporcionó archivo, error
            http_response_code(400);
            echo json_encode(array("message" => "Se requiere un archivo para crear un nuevo calendario."));
            break;
        }

        // Asignar valores comunes
        $calendario->titulo = $_POST['titulo'];
        $calendario->activo = isset($_POST['activo']) ? $_POST['activo'] : true;

        if ($isUpdate) {
            // Actualización
            $calendario->id = $_POST['id'];
            if ($calendario->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Calendario actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el calendario."));
            }
        } else {
            // Creación
            if ($calendario->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Calendario creado correctamente.", "id" => $calendario->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el calendario."));
            }
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $calendario->id = $_GET['id'];
            if ($calendario->readOne()) {
                echo json_encode($calendario);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Calendario no encontrado."));
            }
        } else {
            $stmt = $calendario->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $calendarios_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $calendario_item = array(
                        "id" => $id,
                        "titulo" => $titulo,
                        "archivo" => $archivo,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($calendarios_arr, $calendario_item);
                }
                echo json_encode(array("records" => $calendarios_arr));
            } else {
                http_response_code(200); // Cambiar el código de estado a 200
                echo json_encode(array("records" => array())); // Retornar un arreglo vacío
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));

        if (isset($data->id) && isset($data->activo)) {
            $calendario->id = $data->id;
            $calendario->activo = filter_var($data->activo, FILTER_VALIDATE_BOOLEAN);

            if ($calendario->updateStatus()) {
                http_response_code(200);
                echo json_encode(array("message" => "Estado del calendario actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el estado del calendario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $calendario->id = $_GET['id'];
            if ($calendario->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Calendario eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el calendario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del calendario."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
