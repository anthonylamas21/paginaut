<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Curso.php';

$database = new Database();
$db = $database->getConnection();

$curso = new Curso($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        $isUpdate = isset($_GET['id']);
    
        if ($isUpdate) {
            $curso->id = $_GET['id'];
            // Cargar los datos actuales de la curso
            if (!$curso->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Curso no encontrada."));
                break;
            }
        }
    
        if (!empty($_POST['titulo'])) {
            $curso->titulo = $_POST['titulo'];
            $curso->descripcion = $_POST['descripcion'];
            $curso->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
    
            // Crear o actualizar curso
            if ($isUpdate) {
                $result = $curso->update();
            } else {
                $result = $curso->create();
            }
    
            if ($result) {
                // Procesar imágenes después de crear/actualizar la curso
                $curso->updateImagenes();
    
                http_response_code($isUpdate ? 200 : 201);
                echo json_encode(array(
                    "message" => $isUpdate ? "Curso actualizada correctamente." : "Curso creada correctamente.",
                    "id" => $curso->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la Curso." : "No se pudo crear la Curso."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $curso->id = $_GET['id'];
            if ($curso->readOne()) {
                $curso_arr = array(
                    "id" => $curso->id,
                    "nombre" => $curso->titulo,
                    "activo" => $curso->activo,
                    "fecha_creacion" => $curso->fecha_creacion,
                    "imagen_principal" => $curso->imagen_principal,
                    "imagenes_generales" => $curso->getImagenesGenerales()
                );
                echo json_encode($curso_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Curso no encontrada."));
            }
        } else {
            $cursos_arr = $curso->read();
            if (!empty($cursos_arr)) {
                echo json_encode(array("records" => $cursos_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron Curso."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $curso->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($curso->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Curso activada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar la Curso."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($curso->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Curso desactivada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar la Curso."));
                }
            }
        } else {
            // código de actualización existente
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaImagen'])) {
            // Eliminar una curso completa
            $curso->id = $_GET['id'];
            if ($curso->readOne()) {
                if (!empty($curso->imagen_principal) && file_exists("../" . $curso->imagen_principal)) {
                    unlink("../" . $curso->imagen_principal);
                }
                $imagenesGenerales = $curso->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                if ($curso->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "curso eliminada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar la curso."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "curso no encontrada."));
            }
        } else if (isset($_GET['cursoId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            error_log("Eliminando imagen de curso con id: " . $_GET['cursoId'] . " y rutaImagen: " . $_GET['rutaImagen']);
            $curso->id = $_GET['cursoId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($curso->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la curso o la ruta de la imagen."));
        }
        break;
}

?>