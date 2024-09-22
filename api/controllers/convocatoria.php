<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Convocatoria.php';

$database = new Database();
$db = $database->getConnection();

$convocatoria = new Convocatoria($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'POST':
        $isUpdate = isset($_GET['id']);

        if ($isUpdate) {
            $convocatoria->id = $_GET['id'];
            // Cargar los datos actuales de la convocatoria
            if (!$convocatoria->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Convocatoria no encontrada."));
                break;
            }
        }

        if (!empty($_POST['titulo']) && !empty($_POST['descripcion']) && !empty($_POST['lugar'])) {
            $convocatoria->titulo = $_POST['titulo'];
            $convocatoria->descripcion = $_POST['descripcion'];
            $convocatoria->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
            $convocatoria->lugar = $_POST['lugar'];
            $convocatoria->fecha_inicio = $_POST['fecha_inicio'];
            $convocatoria->fecha_fin = $_POST['fecha_fin'];
            $convocatoria->hora_inicio = $_POST['hora_inicio'];
            $convocatoria->hora_fin = $_POST['hora_fin'];
            $convocatoria->es_curso = isset($_POST['es_curso']) ? filter_var($_POST['es_curso'], FILTER_VALIDATE_BOOLEAN) : false;
            $convocatoria->curso_id = !empty($_POST['curso_id']) ? intval($_POST['curso_id']) : null;  // Manejo del curso_id

            // Crear o actualizar convocatoria
            if ($isUpdate) {
                $result = $convocatoria->update();
            } else {
                $result = $convocatoria->create();
            }

            if ($result) {
                // Procesar imágenes y archivos después de crear/actualizar la convocatoria
                if (!empty($_FILES['imagen_principal'])) {
                    $convocatoria->updateImagenPrincipal($_FILES['imagen_principal']);
                }
                if (!empty($_FILES['imagenes_generales']['name'][0])) {
                    $convocatoria->updateImagenesGenerales($_FILES['imagenes_generales']);
                }
                if (!empty($_FILES['archivos']['name'][0])) {
                    $convocatoria->updateArchivos($_FILES['archivos']);
                }

                http_response_code($isUpdate ? 200 : 201);
                echo json_encode(array(
                    "message" => $isUpdate ? "Convocatoria actualizada correctamente." : "Convocatoria creada correctamente.",
                    "id" => $convocatoria->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la convocatoria." : "No se pudo crear la convocatoria."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $convocatoria->id = $_GET['id'];
            if ($convocatoria->readOne()) {
                $convocatoria_arr = array(
                    "id" => $convocatoria->id,
                    "titulo" => $convocatoria->titulo,
                    "descripcion" => $convocatoria->descripcion,
                    "activo" => $convocatoria->activo,
                    "lugar" => $convocatoria->lugar,
                    "fecha_inicio" => $convocatoria->fecha_inicio,
                    "fecha_fin" => $convocatoria->fecha_fin,
                    "hora_inicio" => $convocatoria->hora_inicio,
                    "hora_fin" => $convocatoria->hora_fin,
                    "imagen_principal" => $convocatoria->imagen_principal,
                    "imagenes_generales" => $convocatoria->getImagenesGenerales(),
                    "archivos" => $convocatoria->getArchivos()
                );
                echo json_encode($convocatoria_arr);
            } elseif (isset($_GET['recent'])) {
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
                $convocatorias_arr = $convocatoria->readRecent($limit);
                if (!empty($convocatorias_arr)) {
                    echo json_encode(array("records" => $convocatorias_arr));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No se encontraron convocatorias recientes."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Convocatoria no encontrada."));
            }
        } else {
            $convocatorias_arr = $convocatoria->read();
            if (!empty($convocatorias_arr)) {
                echo json_encode(array("records" => $convocatorias_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron convocatorias."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $convocatoria->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($convocatoria->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Convocatoria activada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar la convocatoria."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($convocatoria->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Convocatoria desactivada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar la convocatoria."));
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la convocatoria o la acción."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaArchivo'])) {
            // Eliminar una convocatoria completa
            $convocatoria->id = $_GET['id'];
            if ($convocatoria->readOne()) {
                if (!empty($convocatoria->imagen_principal) && file_exists("../" . $convocatoria->imagen_principal)) {
                    unlink("../" . $convocatoria->imagen_principal);
                }
                $imagenesGenerales = $convocatoria->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                $archivos = $convocatoria->getArchivos();
                foreach ($archivos as $archivo) {
                    if (file_exists("../" . $archivo['ruta_archivo'])) {
                        unlink("../" . $archivo['ruta_archivo']);
                    }
                }
                if ($convocatoria->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Convocatoria eliminada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar la convocatoria."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Convocatoria no encontrada."));
            }
        } else if (isset($_GET['eventoId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            $convocatoria->id = $_GET['eventoId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($convocatoria->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else if (isset($_GET['eventoId']) && isset($_GET['rutaArchivo'])) {
            // Eliminar un archivo específico
            $convocatoria->id = $_GET['eventoId'];
            $rutaArchivo = $_GET['rutaArchivo'];
            if ($convocatoria->deleteArchivo($rutaArchivo)) {
                http_response_code(200);
                echo json_encode(array("message" => "Archivo eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el archivo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la convocatoria, la ruta de la imagen o la ruta del archivo."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
