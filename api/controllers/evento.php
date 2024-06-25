<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Evento.php';

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (
            !empty($data->informacion_evento) &&
            isset($data->activo) &&
            !empty($data->fecha_inicio) &&
            !empty($data->fecha_fin) &&
            !empty($data->hora_inicio) &&
            !empty($data->hora_fin)
        ) {
            $evento->informacion_evento = $data->informacion_evento;
            $evento->activo = $data->activo;
            $evento->fecha_inicio = $data->fecha_inicio;
            $evento->fecha_fin = $data->fecha_fin;
            $evento->hora_inicio = $data->hora_inicio;
            $evento->hora_fin = $data->hora_fin;

            if ($evento->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Evento creado correctamente.", "id" => $evento->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el evento. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if ($evento->readOne()) {
                echo json_encode($evento);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Evento no encontrado."));
            }
        } else {
            $stmt = $evento->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $eventos_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $evento_item = array(
                        "id" => $id,
                        "informacion_evento" => $informacion_evento,
                        "activo" => $activo,
                        "fecha_inicio" => $fecha_inicio,
                        "fecha_fin" => $fecha_fin,
                        "hora_inicio" => $hora_inicio,
                        "hora_fin" => $hora_fin,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($eventos_arr, $evento_item);
                }
                echo json_encode($eventos_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron eventos."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $evento->id = $data->id;
            $evento->informacion_evento = $data->informacion_evento;
            $evento->activo = $data->activo;
            $evento->fecha_inicio = $data->fecha_inicio;
            $evento->fecha_fin = $data->fecha_fin;
            $evento->hora_inicio = $data->hora_inicio;
            $evento->hora_fin = $data->hora_fin;

            if ($evento->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Evento actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el evento. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if ($evento->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Evento eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del evento."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
