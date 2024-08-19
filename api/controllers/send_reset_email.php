<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/SendEmail.php';

$database = new Database();
$db = $database->getConnection();

$usuario = new Usuario($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':

        if ($data && isset($data->email)) {
            $usuario->correo = $data->email;

            if ($usuario->index()) {
                http_response_code(200);
                echo json_encode(array("code" => $usuario));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "No se pudo generar el token el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['email'])) {
            $usuario->correo = $_GET['email'];
          
            if ($usuario->store()) {
                
            http_response_code(200);
                echo json_encode(array("message" => "Si existe ese correo"));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "No existe ese correo"));
            }

        }else{
            echo json_encode(array("message" => "No existe la variable"));
        }
        break;

    case 'PUT':
        if ($data && isset($data->email) && isset($data->reset_token)) {
            $usuario->correo = $data->email;
            $usuario->token_recuperacion = $data->reset_token;

            if ($usuario->update()) {
                include_once "./Mail/send_email.php";

                http_response_code(200);
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "No se pudo generar el token el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
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
?>
