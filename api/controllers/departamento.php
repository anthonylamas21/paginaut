<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Departamento.php';

$database = new Database();
$db = $database->getConnection();

$departamento = new Departamento($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
    case 'POST':
        if (!empty($data->nombre)) {
            $departamento->nombre = $data->nombre;

            if ($departamento->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Departamento creado exitosamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el departamento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el departamento. Los datos están incompletos."));
        }
        break;

    case 'GET':
        $stmt = $departamento->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $departamentos_arr = array();
            $departamentos_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $departamento_item = array(
                    "id" => $id,
                    "nombre" => $nombre,
                    "activo" => $activo,
                    "fecha_creacion" => $fecha_creacion
                );
                array_push($departamentos_arr["records"], $departamento_item);
            }
            http_response_code(200);
            echo json_encode($departamentos_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron departamentos."));
        }
        break;

    case 'PUT':
        if (
            !empty($data->id) &&
            !empty($data->nombre) &&
            isset($data->activo)
        ) {
            $departamento->id = $data->id;
            $departamento->nombre = $data->nombre;
            $departamento->activo = $data->activo;

            if ($departamento->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Departamento actualizado exitosamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el departamento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el departamento. Los datos están incompletos."));
        }
        break;

    case 'DELETE':
        if (!empty($data->id)) {
            $departamento->id = $data->id;

            if ($departamento->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Departamento eliminado exitosamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el departamento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo eliminar el departamento. Los datos están incompletos."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
