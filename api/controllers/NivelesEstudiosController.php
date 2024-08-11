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
require_once $root . '/api/models/NivelesEstudios.php';

$database = new Database();
$db = $database->getConnection();

$nivelEstudio = new NivelesEstudios($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id']) && !empty($data['id'])) {
            $nivelEstudio->id = $data['id'];
            if (!$nivelEstudio->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Nivel de estudio no encontrado."));
                break;
            }

            $nivelEstudio->nivel = $data['nivel'];
            $nivelEstudio->activo = $data['activo'];

            if ($nivelEstudio->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Nivel de estudio actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el nivel de estudio."));
            }
        } else {
            $nivelEstudio->nivel = $data['nivel'];
            $nivelEstudio->activo = true;

            if ($nivelEstudio->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Nivel de estudio creado correctamente.", "id" => $nivelEstudio->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el nivel de estudio."));
            }
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $nivelEstudio->id = $_GET['id'];
            if ($nivelEstudio->readOne()) {
                echo json_encode($nivelEstudio);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Nivel de estudio no encontrado."));
            }
        } else {
            $stmt = $nivelEstudio->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $nivelesEstudios_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $nivelEstudio_item = array(
                        "id" => $id,
                        "nivel" => $nivel,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($nivelesEstudios_arr, $nivelEstudio_item);
                }
                echo json_encode(array("records" => $nivelesEstudios_arr));
            } else {
                http_response_code(200);
                echo json_encode(array("records" => array()));
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['id'])) {
            $nivelEstudio->id = $data['id'];
            $nivelEstudio->activo = $data['activo'];

            if ($nivelEstudio->updateStatus()) {
                http_response_code(200);
                echo json_encode(array("message" => "Estado del nivel de estudio actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el estado del nivel de estudio."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $nivelEstudio->id = $_GET['id'];
            if ($nivelEstudio->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Nivel de estudio eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el nivel de estudio."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del nivel de estudio."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
