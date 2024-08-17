<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/SendEmail.php';

$database = new Database();
$db = $database->getConnection();

$usuario = new Usuario($db);

$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->codigo)) {
            $usuario->token_recuperacion = $data->codigo;
            if($usuario->verifyCode()){
                http_response_code(200);
                echo json_encode(array("message" => "Código verificado correctamente."));
            }else{
                http_response_code(400);
                echo json_encode(array("message" => "Código incorrecto"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos"));
        }
        break;

    case 'GET':
        if (isset($_GET['email'])) {
            
        }
        break;

    case 'PUT':
        if (!empty($data->password) && !empty($data->email)) {
            $usuario->contrasena = $data->password;
            $usuario->correo = $data->email;
        
                if ($usuario->updatePassword()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Contraseña actualizada correctamente"));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Error al actualizar la contraseña"));
                }
        
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos"));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $usuario->id = $_GET['id'];

        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}