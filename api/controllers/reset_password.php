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

if (!empty($data->token) && !empty($data->nueva_contrasena)) {
    $usuario->token_recuperacion = $data->token;
    $stmt = $usuario->readOne();

    if ($stmt && $usuario->fecha_expiracion_token >= date('Y-m-d H:i:s')) {
        $usuario->contrasena = password_hash(htmlspecialchars(strip_tags($data->nueva_contrasena)), PASSWORD_DEFAULT);
        $usuario->token_recuperacion = null;
        $usuario->fecha_expiracion_token = null;

        if ($usuario->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Contraseña actualizada correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar la contraseña"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Token de recuperación inválido o expirado"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos"));
}