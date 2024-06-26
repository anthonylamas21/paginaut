<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Historial.php';

$database = new Database();
$db = $database->getConnection();

$historial = new Historial($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        // Crear un registro de historial
        if (!empty($data->tabla) && !empty($data->operacion) && !empty($data->registro_id) && !empty($data->datos_anteriores) && !empty($data->hora)) {
            $historial->tabla = $data->tabla;
            $historial->operacion = $data->operacion;
            $historial->registro_id = $data->registro_id;
            $historial->datos_anteriores = $data->datos_anteriores;
            $historial->hora = $data->hora;

            if ($historial->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Registro de historial creado correctamente.", "id" => $historial->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el registro de historial."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el registro de historial. Datos incompletos."));
        }
        break;
    
    case 'GET':
        // Leer un registro de historial por ID
        if (isset($_GET['id'])) {
            $historial->id = $_GET['id'];
            if ($historial->readOne()) {
                echo json_encode($historial);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Registro de historial no encontrado."));
            }
        } else {
            // Leer todos los registros de historial
            $stmt = $historial->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $historiales_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $historial_item = array(
                        "id" => $id,
                        "tabla" => $tabla,
                        "operacion" => $operacion,
                        "registro_id" => $registro_id,
                        "datos_anteriores" => json_decode($datos_anteriores),
                        "fecha" => $fecha,
                        "hora" => $hora
                    );
                    array_push($historiales_arr, $historial_item);
                }
                echo json_encode($historiales_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron registros de historial."));
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>