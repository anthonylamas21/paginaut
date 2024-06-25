<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Rol.php';

$database = new Database();
$db = $database->getConnection();

$rol = new Rol($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->nombre)) {
            $rol->nombre = $data->nombre;
    
            if ($rol->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Rol creado correctamente.", "id" => $rol->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el rol."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el rol. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $rol->id = $_GET['id'];
            if ($rol->readOne()) {
                echo json_encode($rol);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Rol no encontrado."));
            }
        } else {
            $stmt = $rol->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $roles_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $rol_item = array(
                        "id" => $id,
                        "nombre" => $nombre,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($roles_arr, $rol_item);
                }
                echo json_encode(array("records" => $roles_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron roles."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $rol->id = $data->id;
            $rol->nombre = $data->nombre;
            $rol->activo = $data->activo;

            if ($rol->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Rol actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el rol."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el rol. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $rol->id = $_GET['id'];
            if ($rol->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Rol eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el rol."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del rol."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
