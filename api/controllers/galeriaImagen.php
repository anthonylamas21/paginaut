<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/GaleriaImagen.php';

$database = new Database();
$db = $database->getConnection();

$galeriaImagen = new GaleriaImagen($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->tipo) && !empty($data->ruta_imagen)) {
            $galeriaImagen->tipo = $data->tipo;
            $galeriaImagen->asociado_id = $data->asociado_id ?? null;
            $galeriaImagen->ruta_imagen = $data->ruta_imagen;

            if ($galeriaImagen->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Imagen de galería creada correctamente.", "id" => $galeriaImagen->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la imagen de galería."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la imagen de galería. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $galeriaImagen->id = $_GET['id'];
            if ($galeriaImagen->readOne()) {
                echo json_encode($galeriaImagen);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Imagen de galería no encontrada."));
            }
        } else {
            $stmt = $galeriaImagen->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $galeriaImagenes_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $galeriaImagen_item = array(
                        "id" => $id,
                        "tipo" => $tipo,
                        "asociado_id" => $asociado_id,
                        "ruta_imagen" => $ruta_imagen,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($galeriaImagenes_arr, $galeriaImagen_item);
                }
                echo json_encode($galeriaImagenes_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron imágenes de galería."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id) && !empty($data->tipo) && !empty($data->ruta_imagen)) {
            $galeriaImagen->id = $data->id;
            $galeriaImagen->tipo = $data->tipo;
            $galeriaImagen->asociado_id = $data->asociado_id ?? null;
            $galeriaImagen->ruta_imagen = $data->ruta_imagen;

            if ($galeriaImagen->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen de galería actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la imagen de galería."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la imagen de galería. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $galeriaImagen->id = $_GET['id'];
            if ($galeriaImagen->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen de galería eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen de galería."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la imagen de galería."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
