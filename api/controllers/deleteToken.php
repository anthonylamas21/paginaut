<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Usuario.php';

$database = new Database();
$db = $database->getConnection();

$usuario = new Usuario($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->token)) {
    // Asignar el token si existe, dando prioridad a $data->token
    $usuario->token = $data->token;

    if (isset($usuario->token)) {
        $verify_token = $usuario->VerifyTokenExist($usuario->token);

        if ($verify_token) {
            // Verificar si uno de los elementos no está presente
            if (empty($data->token)) {
                $token_insertado = $usuario->delete_token_sesion($usuario->token);

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Se cerró la sesión debido a la ausencia del token en localStorage"
                ));
            } else {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "El token está presente y la sesión continúa"
                ));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "No se encuentra el token"));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "No se encuentra el token"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Error al cerrar sesión"));
}
?>
