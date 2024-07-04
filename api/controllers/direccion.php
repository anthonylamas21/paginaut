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
require_once $root . '/api/models/Direccion.php';

$database = new Database();
$db = $database->getConnection();

$direccion = new Direccion($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->abreviatura) && !empty($data->nombre)) {
            $direccion->abreviatura = $data->abreviatura;
            $direccion->nombre = $data->nombre;

            if ($direccion->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Dirección creada correctamente.", "id" => $direccion->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la dirección."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la dirección. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $direccion->id = $_GET['id'];
            if ($direccion->readOne()) {
                echo json_encode($direccion);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Dirección no encontrada."));
            }
        } else {
            $stmt = $direccion->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $direcciones_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $direccion_item = array(
                        "id" => $id,
                        "abreviatura" => $abreviatura,
                        "nombre" => $nombre,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($direcciones_arr, $direccion_item);
                }
                echo json_encode(array("records" => $direcciones_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron direcciones."));
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->id)) {
            $direccion->id = $data->id;
            $direccion->abreviatura = $data->abreviatura;
            $direccion->nombre = $data->nombre;
            $direccion->activo = $data->activo;

            if ($direccion->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Dirección actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la dirección."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la dirección. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $direccion->id = $_GET['id'];
            if ($direccion->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Dirección eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la dirección."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la dirección."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>