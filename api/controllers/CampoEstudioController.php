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
require_once $root . '/api/models/CampoEstudio.php';

$database = new Database();
$db = $database->getConnection();

$campoEstudio = new CampoEstudio($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id']) && !empty($data['id'])) {
            $campoEstudio->id = $data['id'];
            if (!$campoEstudio->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Campo de estudio no encontrado."));
                break;
            }

            $campoEstudio->campo = $data['campo'];
            $campoEstudio->activo = $data['activo'];

            if ($campoEstudio->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Campo de estudio actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el campo de estudio."));
            }
        } else {
            $campoEstudio->campo = $data['campo'];
            $campoEstudio->activo = true;

            if ($campoEstudio->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Campo de estudio creado correctamente.", "id" => $campoEstudio->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el campo de estudio."));
            }
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $campoEstudio->id = $_GET['id'];
            if ($campoEstudio->readOne()) {
                echo json_encode($campoEstudio);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Campo de estudio no encontrado."));
            }
        } else {
            $stmt = $campoEstudio->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $camposEstudios_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $campoEstudio_item = array(
                        "id" => $id,
                        "campo" => $campo,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($camposEstudios_arr, $campoEstudio_item);
                }
                echo json_encode(array("records" => $camposEstudios_arr));
            } else {
                http_response_code(200);
                echo json_encode(array("records" => array()));
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['id'])) {
            $campoEstudio->id = $data['id'];
            $campoEstudio->activo = $data['activo'];

            if ($campoEstudio->updateStatus()) {
                http_response_code(200);
                echo json_encode(array("message" => "Estado del campo de estudio actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el estado del campo de estudio."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $campoEstudio->id = $_GET['id'];
            if ($campoEstudio->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Campo de estudio eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el campo de estudio."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del campo de estudio."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
