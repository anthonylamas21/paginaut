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
try {
    if (!empty($data->correo) && !empty($data->contrasena)) {
        $usuario->correo = $data->correo;
        $usuario->contrasena = $data->contrasena;

        $usuarioLogeado = $usuario->correo;

        if ($usuario->login($usuario->correo, $usuario->contrasena)) {
            $token = bin2hex(random_bytes(32)); // Genera 64 caracteres hexadecimales
            $token_encriptado = password_hash($token, PASSWORD_DEFAULT); // Encriptar token
            $token_insertado = $usuario->create_token_sesion($usuario->correo, $token_encriptado); // Insertar token en la base de datos

            http_response_code(200);
            echo json_encode(array(
                "message" => "Inicio de sesión exitoso de " . $usuarioLogeado,
                "token" => $token_encriptado,
                "usuario" => array(
                    "id" => $usuario->id,
                    "correo" => $usuario->correo,
                    "rol_id" => $usuario->rol_id,
                    "departamento_id" => $usuario->departamento_id,
                    "token_recuperacion" => $usuario->token_recuperacion,
                    "fecha_expiracion_token" => $usuario->fecha_expiracion_token,
                    "activo" => $usuario->activo,
                    "fecha_creacion" => $usuario->fecha_creacion
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Credenciales incorrectas"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos"));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Ocurrió un error en el servidor", "error" => $e->getMessage()));
}
