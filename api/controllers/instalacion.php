<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Instalacion.php';

$database = new Database();
$db = $database->getConnection();

$instalacion = new Instalacion($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        $isUpdate = isset($_GET['id']);
    
        if ($isUpdate) {
            $instalacion->id = $_GET['id'];
            // Cargar los datos actuales de la instalacion
            if (!$instalacion->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "instalacion no encontrada."));
                break;
            }
        }
    
        if (!empty($_POST['titulo'])) {
            $instalacion->titulo = $_POST['titulo'];
            $instalacion->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
    
            // Crear o actualizar instalacion
            if ($isUpdate) {
                $result = $instalacion->update();
            } else {
                $result = $instalacion->create();
            }
    
            if ($result) {
                // Procesar imágenes después de crear/actualizar la instalacion
                $instalacion->updateImagenes();
    
                http_response_code($isUpdate ? 200 : 201);
                echo json_encode(array(
                    "message" => $isUpdate ? "Instalacion actualizada correctamente." : "Instalacion creada correctamente.",
                    "id" => $instalacion->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la Instalacion." : "No se pudo crear la Instalacion."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $instalacion->id = $_GET['id'];
            if ($instalacion->readOne()) {
                $instalacion_arr = array(
                    "id" => $instalacion->id,
                    "nombre" => $instalacion->titulo,
                    "activo" => $instalacion->activo,
                    "fecha_creacion" => $instalacion->fecha_creacion,
                    "imagen_principal" => $instalacion->imagen_principal,
                    "imagenes_generales" => $instalacion->getImagenesGenerales()
                );
                echo json_encode($instalacion_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Instalacion no encontrada."));
            }
        } else {
            $instalaciones_arr = $instalacion->read();
            if (!empty($instalaciones_arr)) {
                echo json_encode(array("records" => $instalaciones_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron Instalacion."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $instalacion->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($instalacion->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Instalacion activada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar la Instalacion."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($instalacion->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Instalacion desactivada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar la Instalacion."));
                }
            }
        } else {
            // código de actualización existente
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaImagen'])) {
            // Eliminar una instalacion completa
            $instalacion->id = $_GET['id'];
            if ($instalacion->readOne()) {
                if (!empty($instalacion->imagen_principal) && file_exists("../" . $instalacion->imagen_principal)) {
                    unlink("../" . $instalacion->imagen_principal);
                }
                $imagenesGenerales = $instalacion->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                if ($instalacion->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Instalacion eliminada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar la Instalacion."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Instalacion no encontrada."));
            }
        } else if (isset($_GET['instalacionId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            error_log("Eliminando imagen de Instalacion con id: " . $_GET['instalacionId'] . " y rutaImagen: " . $_GET['rutaImagen']);
            $instalacion->id = $_GET['instalacionId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($instalacion->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la Instalacion o la ruta de la imagen."));
        }
        break;
}

?>