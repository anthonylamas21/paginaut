<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Direccion.php';

$database = new Database();
$db = $database->getConnection();
$direccion = new Direccion($db);

// Determinar qué operación se está solicitando
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Crear una nueva dirección
        $data = json_decode(file_get_contents("php://input"));

        // Verificar si se proporcionaron todos los datos requeridos
        if (!empty($data->nombre)) {
            $direccion->nombre = $data->nombre;
            $direccion->activo = isset($data->activo) ? $data->activo : true;

            if ($direccion->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Direccion creada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la direccion."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create direccion. Data is incomplete."));
        }
        break;

    case 'GET':
        // Leer todas las direcciones
        $stmt = $direccion->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $direcciones_arr = array();
            $direcciones_arr["direcciones"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $direccion_item = array(
                    "id" => $id,
                    "nombre" => $nombre,
                    "activo" => $activo,
                    "fecha_creacion" => $fecha_creacion
                );
                array_push($direcciones_arr["direcciones"], $direccion_item);
            }

            http_response_code(200);
            echo json_encode($direcciones_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron direcciones."));
        }
        break;

    default:
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
