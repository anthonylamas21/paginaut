<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Persona.php';
include_once $root . '/models/Usuario.php';

$database = new Database();
$db = $database->getConnection();

$persona = new Persona($db);
$usuario = new Usuario($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        // Comprobar que se han proporcionado los datos necesarios
        if (
            !empty($data->persona_nombre) &&
            !empty($data->persona_primer_apellido) &&
            !empty($data->correo) &&
            !empty($data->contraseña) &&
            !empty($data->rol_id) &&
            !empty($data->departamento_id)
        ) {
            // Preparar los datos del usuario
            $usuario->correo = $data->correo;
            $usuario->contraseña = password_hash($data->contraseña, PASSWORD_DEFAULT); // Hashea la contraseña
            $usuario->rol_id = $data->rol_id;
            $usuario->departamento_id = $data->departamento_id;
            $usuario->token_recuperacion = isset($data->token_recuperacion) ? $data->token_recuperacion : null;
            $usuario->fecha_expiracion_token = isset($data->fecha_expiracion_token) ? $data->fecha_expiracion_token : null;
            $usuario->activo = isset($data->activo) ? $data->activo : true;
    
            // Usar el método create de Usuario para insertar persona y usuario
            if ($usuario->create($data->persona_nombre, $data->persona_primer_apellido, $data->persona_segundo_apellido ?? null, $data->persona_fecha_nacimiento ?? null)) {
                http_response_code(201);
                echo json_encode(array("message" => "Persona y usuario creados correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la persona y el usuario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la persona y el usuario. Datos incompletos."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
