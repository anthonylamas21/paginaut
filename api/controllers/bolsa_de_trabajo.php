<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/BolsaDeTrabajo.php';

$database = new Database();
$db = $database->getConnection();

$bolsa_de_trabajo = new BolsaDeTrabajo($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->informacion_oferta)) {
            $bolsa_de_trabajo->informacion_oferta = $data->informacion_oferta;
            $bolsa_de_trabajo->correo_empresa = $data->correo_empresa ?? null;
            $bolsa_de_trabajo->telefono_empresa = $data->telefono_empresa ?? null;

            if ($bolsa_de_trabajo->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Oferta de trabajo creada correctamente.", "id" => $bolsa_de_trabajo->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la oferta de trabajo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la oferta de trabajo. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $bolsa_de_trabajo->id = $_GET['id'];
            if ($bolsa_de_trabajo->readOne()) {
                echo json_encode($bolsa_de_trabajo);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Oferta de trabajo no encontrada."));
            }
        } else {
            $stmt = $bolsa_de_trabajo->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $ofertas_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $oferta_item = array(
                        "id" => $id,
                        "informacion_oferta" => $informacion_oferta,
                        "correo_empresa" => $correo_empresa,
                        "telefono_empresa" => $telefono_empresa,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($ofertas_arr, $oferta_item);
                }
                echo json_encode($ofertas_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron ofertas de trabajo."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $bolsa_de_trabajo->id = $data->id;
            $bolsa_de_trabajo->informacion_oferta = $data->informacion_oferta;
            $bolsa_de_trabajo->correo_empresa = $data->correo_empresa ?? null;
            $bolsa_de_trabajo->telefono_empresa = $data->telefono_empresa ?? null;

            if ($bolsa_de_trabajo->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Oferta de trabajo actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la oferta de trabajo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la oferta de trabajo. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $bolsa_de_trabajo->id = $_GET['id'];
            if ($bolsa_de_trabajo->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Oferta de trabajo eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la oferta de trabajo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la oferta de trabajo."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
