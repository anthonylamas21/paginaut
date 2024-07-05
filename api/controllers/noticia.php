<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Noticia.php';

$database = new Database();
$db = $database->getConnection();

$noticia = new Noticia($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        $isUpdate = isset($_GET['id']);
    
        if ($isUpdate) {
            $noticia->id = $_GET['id'];
            // Cargar los datos actuales de la noticia
            if (!$noticia->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Noticia no encontrada."));
                break;
            }
        }
    
        if (!empty($_POST['titulo']) && !empty($_POST['informacion_noticia']) && !empty($_POST['lugar_noticia'])) {
            $noticia->titulo = $_POST['titulo'];
            $noticia->resumen = $_POST['resumen'];
            $noticia->informacion_noticia = $_POST['informacion_noticia'];
            $noticia->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
            $noticia->lugar_noticia = $_POST['lugar_noticia'];
            $noticia->autor = $_POST['autor'];
            $noticia->fecha_publicacion = $_POST['fecha_publicacion'];
    
            // Crear o actualizar noticia
            if ($isUpdate) {
                $result = $noticia->update();
            } else {
                $result = $noticia->create();
            }
    
            if ($result) {
                // Procesar imágenes después de crear/actualizar la noticia
                $noticia->updateImagenes();
    
                http_response_code($isUpdate ? 200 : 201);
                echo json_encode(array(
                    "message" => $isUpdate ? "Noticia actualizada correctamente." : "Noticia creada correctamente.",
                    "id" => $noticia->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la noticia." : "No se pudo crear la noticia."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $noticia->id = $_GET['id'];
            if ($noticia->readOne()) {
                $noticia_arr = array(
                    "id" => $noticia->id,
                    "titulo" => $noticia->titulo,
                    "resumen" => $noticia->resumen,
                    "informacion_noticia" => $noticia->informacion_noticia,
                    "activo" => $noticia->activo,
                    "lugar_noticia" => $noticia->lugar_noticia,
                    "autor" => $noticia->autor,
                    "fecha_publicacion" => $noticia->fecha_publicacion,
                    "fecha_creacion" => $noticia->fecha_creacion,
                    "imagen_principal" => $noticia->imagen_principal,
                    "imagenes_generales" => $noticia->getImagenesGenerales()
                );
                echo json_encode($noticia_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Noticia no encontrada."));
            }
        } else {
            $noticias_arr = $noticia->read();
            if (!empty($noticias_arr)) {
                echo json_encode(array("records" => $noticias_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron noticias."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $noticia->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($noticia->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Noticia activada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar la noticia."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($noticia->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Noticia desactivada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar la noticia."));
                }
            }
        } else {
            // código de actualización existente
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaImagen'])) {
            // Eliminar una noticia completa
            $noticia->id = $_GET['id'];
            if ($noticia->readOne()) {
                if (!empty($noticia->imagen_principal) && file_exists("../" . $noticia->imagen_principal)) {
                    unlink("../" . $noticia->imagen_principal);
                }
                $imagenesGenerales = $noticia->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                if ($noticia->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Noticia eliminada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar la noticia."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Noticia no encontrada."));
            }
        } else if (isset($_GET['noticiaId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            error_log("Eliminando imagen de noticia con id: " . $_GET['noticiaId'] . " y rutaImagen: " . $_GET['rutaImagen']);
            $noticia->id = $_GET['noticiaId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($noticia->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la noticia o la ruta de la imagen."));
        }
        break;
}

?>