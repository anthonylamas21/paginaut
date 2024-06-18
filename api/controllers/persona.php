<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Persona.php';

$database = new Database();
$db = $database->getConnection();

$persona = new Persona($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (
            !empty($data->nombre) &&
            !empty($data->primer_apellido)
        ) {
            $persona->nombre = $data->nombre;
            $persona->primer_apellido = $data->primer_apellido;
            $persona->segundo_apellido = isset($data->segundo_apellido) ? $data->segundo_apellido : null;
            $persona->fecha_nacimiento = isset($data->fecha_nacimiento) ? $data->fecha_nacimiento : null;
            $persona->activo = isset($data->activo) ? $data->activo : true;

            if ($persona->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Persona was created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create persona."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create persona. Data is incomplete."));
        }
        break;

    case 'GET':
        $stmt = $persona->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $personas_arr = array();
            $personas_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $persona_item = array(
                    "id" => $id,
                    "nombre" => $nombre,
                    "primer_apellido" => $primer_apellido,
                    "segundo_apellido" => $segundo_apellido,
                    "fecha_nacimiento" => $fecha_nacimiento,
                    "activo" => $activo,
                    "fecha_creacion" => $fecha_creacion,
                    "fecha_actualizacion" => $fecha_actualizacion
                );
                array_push($personas_arr["records"], $persona_item);
            }
            http_response_code(200);
            echo json_encode($personas_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No personas found."));
        }
        break;

    case 'PUT':
        if (
            !empty($data->id) &&
            !empty($data->nombre) &&
            !empty($data->primer_apellido)
        ) {
            $persona->id = $data->id;
            $persona->nombre = $data->nombre;
            $persona->primer_apellido = $data->primer_apellido;
            $persona->segundo_apellido = isset($data->segundo_apellido) ? $data->segundo_apellido : null;
            $persona->fecha_nacimiento = isset($data->fecha_nacimiento) ? $data->fecha_nacimiento : null;
            $persona->activo = isset($data->activo) ? $data->activo : true;

            if ($persona->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Persona was updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update persona."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to update persona. Data is incomplete."));
        }
        break;

    case 'DELETE':
        if (!empty($data->id)) {
            $persona->id = $data->id;

            if ($persona->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Persona was deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete persona."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to delete persona. Data is incomplete."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
