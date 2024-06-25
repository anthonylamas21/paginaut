<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Cuatrimestre.php';

$database = new Database();
$db = $database->getConnection();

$cuatrimestre = new Cuatrimestre($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->numero) && !empty($data->carrera_id)) {
            $cuatrimestre->numero = $data->numero;
            $cuatrimestre->carrera_id = $data->carrera_id;
            $cuatrimestre->activo = $data->activo ?? true;

            if ($cuatrimestre->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Cuatrimestre creado correctamente.", "id" => $cuatrimestre->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el cuatrimestre."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el cuatrimestre. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $cuatrimestre->id = $_GET['id'];
            if ($cuatrimestre->readOne()) {
                echo json_encode($cuatrimestre);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Cuatrimestre no encontrado."));
            }
        } else {
            $stmt = $cuatrimestre->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $cuatrimestres_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $cuatrimestre_item = array(
                        "id" => $id,
                        "numero" => $numero,
                        "carrera_id" => $carrera_id,
                        "carrera_nombre" => $nombre_carrera,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($cuatrimestres_arr, $cuatrimestre_item);
                }
                echo json_encode($cuatrimestres_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron cuatrimestres."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $cuatrimestre->id = $data->id;
            $cuatrimestre->numero = $data->numero;
            $cuatrimestre->carrera_id = $data->carrera_id;
            $cuatrimestre->activo = $data->activo ?? true;

            if ($cuatrimestre->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cuatrimestre actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el cuatrimestre."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el cuatrimestre. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $cuatrimestre->id = $_GET['id'];
            if ($cuatrimestre->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cuatrimestre eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el cuatrimestre."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del cuatrimestre."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>