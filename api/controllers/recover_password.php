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

if (!empty($data->correo)) {
    $usuario->correo = $data->correo;
    $stmt = $usuario->readOne();

    if ($stmt) {
        $token = $usuario->generateRecoveryToken();
        $usuario->update();

        // Aquí puedes enviar un correo electrónico al usuario con el token de recuperación

        http_response_code(200);
        echo json_encode(array("message" => "Se ha enviado un correo electrónico con las instrucciones para recuperar la contraseña"));
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No se encontró un usuario con ese correo electrónico"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos"));
}