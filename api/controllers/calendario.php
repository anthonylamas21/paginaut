<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Calendario.php';

$database = new Database();
$db = $database->getConnection();

$calendario = new Calendario($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->titulo) && !empty($data->archivo_id)) {
            $calendario->titulo = $data->titulo;
            $calendario->archivo_id = $data->archivo_id;

            if ($calendario->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Calendario creado correctamente.", "id" => $calendario->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el calendario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el calendario. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $calendario->id = $_GET['id'];
            if ($calendario->readOne()) {
                $calendario_arr = array(
                    "id" => $calendario->id,
                    "titulo" => $calendario->titulo,
                    "archivo_id" => $calendario->archivo_id,
                    "activo" => $calendario->activo,
                    "fecha_creacion" => $calendario->fecha_creacion
                );
                echo json_encode($calendario_arr);
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
                        "archivo_id" => $archivo_id,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($calendarios_arr, $calendario_item);
                }
                echo json_encode(array("records" => $calendarios_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron calendarios."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $calendario->id = $data->id;
            $calendario->titulo = $data->titulo;
            $calendario->archivo_id = $data->archivo_id;
            $calendario->activo = $data->activo;

            if ($calendario->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Calendario actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el calendario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el calendario. Datos incompletos."));
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
?>