<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Carrera.php';

$database = new Database();
$db = $database->getConnection();

$carrera = new Carrera($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (
            !empty($data->nombre_carrera) &&
            !empty($data->perfil_profesional) &&
            !empty($data->ocupacion_profesional) &&
            !empty($data->direccion_id)
        ) {
            $carrera->nombre_carrera = $data->nombre_carrera;
            $carrera->perfil_profesional = $data->perfil_profesional;
            $carrera->ocupacion_profesional = $data->ocupacion_profesional;
            $carrera->imagen_carrera = $data->imagen_carrera ?? null;
            $carrera->direccion_id = $data->direccion_id;
            $carrera->activo = $data->activo ?? true;

            if ($carrera->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Carrera creada correctamente.", "id" => $carrera->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la carrera."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la carrera. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $carrera->id = $_GET['id'];
            if ($carrera->readOne()) {
                echo json_encode($carrera);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Carrera no encontrada."));
            }
        } else {
            $stmt = $carrera->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $carreras_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $carrera_item = array(
                        "id" => $id,
                        "nombre_carrera" => $nombre_carrera,
                        "perfil_profesional" => $perfil_profesional,
                        "ocupacion_profesional" => $ocupacion_profesional,
                        "imagen_carrera" => $imagen_carrera,
                        "direccion_id" => $direccion_id,
                        "nombre_direccion" => $nombre_direccion,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($carreras_arr, $carrera_item);
                }
                echo json_encode($carreras_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron carreras."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $carrera->id = $data->id;
            $carrera->nombre_carrera = $data->nombre_carrera;
            $carrera->perfil_profesional = $data->perfil_profesional;
            $carrera->ocupacion_profesional = $data->ocupacion_profesional;
            $carrera->imagen_carrera = $data->imagen_carrera ?? null;
            $carrera->direccion_id = $data->direccion_id;
            $carrera->activo = $data->activo ?? true;

            if ($carrera->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Carrera actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la carrera."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la carrera. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $carrera->id = $_GET['id'];
            if ($carrera->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Carrera eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la carrera."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la carrera."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>