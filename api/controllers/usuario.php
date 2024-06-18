<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Usuario.php';

$database = new Database();
$db = $database->getConnection();

$usuario = new Usuario($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->correo) && !empty($data->contrasena)) {
            $usuario->correo = $data->correo;
            $usuario->contrasena = $data->contrasena;
            $usuario->rol_id = isset($data->rol_id) ? $data->rol_id : null;
            $usuario->departamento_id = isset($data->departamento_id) ? $data->departamento_id : null;
            $usuario->token_recuperacion = isset($data->token_recuperacion) ? $data->token_recuperacion : null;
            $usuario->fecha_expiracion_token = isset($data->fecha_expiracion_token) ? $data->fecha_expiracion_token : null;
            $usuario->activo = isset($data->activo) ? $data->activo : true;

            if ($usuario->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Usuario creado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $usuario->id = $_GET['id'];
            $usuario->readOne();
            if ($usuario->correo) {
                echo json_encode(array(
                    "id" => $usuario->id,
                    "correo" => $usuario->correo,
                    "rol_id" => $usuario->rol_id,
                    "departamento_id" => $usuario->departamento_id,
                    "token_recuperacion" => $usuario->token_recuperacion,
                    "fecha_expiracion_token" => $usuario->fecha_expiracion_token,
                    "activo" => $usuario->activo,
                    "fecha_creacion" => $usuario->fecha_creacion
                ));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Usuario no encontrado."));
            }
        } else {
            $stmt = $usuario->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $usuarios_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $usuario_item = array(
                        "id" => $id,
                        "correo" => $correo,
                        "rol_id" => $rol_id,
                        "departamento_id" => $departamento_id,
                        "token_recuperacion" => $token_recuperacion,
                        "fecha_expiracion_token" => $fecha_expiracion_token,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($usuarios_arr, $usuario_item);
                }
                echo json_encode(array("records" => $usuarios_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron usuarios."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $usuario->id = $data->id;
            $usuario->correo = $data->correo;
            $usuario->rol_id = $data->rol_id;
            $usuario->departamento_id = $data->departamento_id;
            $usuario->token_recuperacion = $data->token_recuperacion;
            $usuario->fecha_expiracion_token = $data->fecha_expiracion_token;
            $usuario->activo = $data->activo;

            if ($usuario->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Usuario actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $usuario->id = $_GET['id'];
            if ($usuario->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Usuario eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del usuario."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
