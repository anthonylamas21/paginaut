<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Taller.php';

$database = new Database();
$db = $database->getConnection();

$taller = new Taller($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        $isUpdate = isset($_GET['id']);
    
        if ($isUpdate) {
            $taller->id = $_GET['id'];
            // Cargar los datos actuales de la taller
            if (!$taller->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "taller no encontrada."));
                break;
            }
        }
    
        if (!empty($_POST['nombre'])) {
            $taller->nombre = $_POST['nombre'];
            $taller->descripcion = $_POST['descripcion'];
            $taller->competencia = $_POST['competencia'];
            $taller->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
    
            // Crear o actualizar taller
            if ($isUpdate) {
                $result = $taller->update();
            } else {
                $result = $taller->create();
            }
    
            if ($result) {
                // Procesar imágenes después de crear/actualizar la taller
                $taller->updateImagenes();
    
                http_response_code($isUpdate ? 200 : 201);
                echo json_encode(array(
                    "message" => $isUpdate ? "taller actualizada correctamente." : "taller creada correctamente.",
                    "id" => $taller->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la taller." : "No se pudo crear la taller."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $taller->id = $_GET['id'];
            if ($taller->readOne()) {
                $taller_arr = array(
                    "id" => $taller->id,
                    "nombre" => $taller->nombre,
                    "descripcion" => $taller->descripcion,
                    "competencia" => $taller->competencia,
                    "activo" => $taller->activo,
                    "fecha_creacion" => $taller->fecha_creacion,
                    "imagen_principal" => $taller->imagen_principal,
                    "imagenes_generales" => $taller->getImagenesGenerales()
                );
                echo json_encode($taller_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Taller no encontrado."));
            }
        } else {
            $talleres_arr = $taller->read();
            if (!empty($talleres_arr)) {
                echo json_encode(array("records" => $talleres_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron Talleres."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $taller->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($taller->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Taller activado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar el Taller."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($taller->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Taller desactivada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar la Taller."));
                }
            }
        } else {
            // código de actualización existente
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaImagen'])) {
            // Eliminar un taller completo
            $taller->id = $_GET['id'];
            if ($taller->readOne()) {
                if (!empty($taller->imagen_principal) && file_exists("../" . $taller->imagen_principal)) {
                    unlink("../" . $taller->imagen_principal);
                }
                $imagenesGenerales = $taller->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                if ($taller->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Taller eliminado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar el Taller."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Taller no encontrada."));
            }
        } else if (isset($_GET['tallerId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            error_log("Eliminando imagen de taller con id: " . $_GET['tallerId'] . " y rutaImagen: " . $_GET['rutaImagen']);
            $taller->id = $_GET['tallerId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($taller->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del Taller o la ruta de la imagen."));
        }
        break;
}

?>