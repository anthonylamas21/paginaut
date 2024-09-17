<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Visitas.php';

$database = new Database();
$db = $database->getConnection();

$visita = new Visita($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->direccion)) {
            $visita->ip_address = $data->direccion;

            // Verificar si la IP ya está registrada
            if ($visita->findByIpHashed($data->direccion)) {
                echo json_encode(array("message" => "La IP ya está registrada. No se contará como nueva visita."));
            } else {
                // Si la IP no está registrada, crear un nuevo registro
                if ($visita->create()) {
                    echo json_encode(array("message" => "Registro creado."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "No se pudo crear el registro."));
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear registro. Datos incompletos."));
        }
        break;

    case 'GET':
        
        $total_visitas = $visita->read();

        if($total_visitas !== false) {  
            // Devolver el número total de visitas en formato JSON
            echo json_encode(array("message" => true, "views" => $total_visitas));
        } else {
            echo json_encode(array("message" => false));
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
          
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $address->id = $_GET['id'];
           
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del ip."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
