<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/ImagenEvento.php';

$database = new Database();
$db = $database->getConnection();

$imagenEvento = new ImagenEvento($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->evento_id) && !empty($data->ruta_imagen)) {
            $imagenEvento->evento_id = $data->evento_id;
            $imagenEvento->ruta_imagen = $data->ruta_imagen;

            if ($imagenEvento->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Imagen de evento creada correctamente.", "id" => $imagenEvento->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la imagen de evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la imagen de evento. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $imagenEvento->id = $_GET['id'];
            if ($imagenEvento->readOne()) {
                echo json_encode($imagenEvento);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Imagen de evento no encontrada."));
            }
        } else {
            $stmt = $imagenEvento->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $imagenEventos_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $imagenEvento_item = array(
                        "id" => $id,
                        "evento_id" => $evento_id,
                        "ruta_imagen" => $ruta_imagen
                    );
                    array_push($imagenEventos_arr, $imagenEvento_item);
                }
                echo json_encode($imagenEventos_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron imágenes de eventos."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $imagenEvento->id = $data->id;
            $imagenEvento->evento_id = $data->evento_id;
            $imagenEvento->ruta_imagen = $data->ruta_imagen;

            if ($imagenEvento->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen de evento actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la imagen de evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la imagen de evento. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $imagenEvento->id = $_GET['id'];
            if ($imagenEvento->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen de evento eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen de evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la imagen de evento."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
