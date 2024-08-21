<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once 'config/database.php';
require_once 'models/Evento.php';

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
  case 'POST':
    $isUpdate = isset($_GET['id']);

    if ($isUpdate) {
        $evento->id = $_GET['id'];
        // Cargar los datos actuales del evento
        if (!$evento->readOne()) {
            http_response_code(404);
            echo json_encode(array("message" => "Evento no encontrado."));
            break;
        }
    }

    if (!empty($_POST['titulo']) && !empty($_POST['informacion_evento']) && !empty($_POST['lugar_evento'])) {
      $evento->titulo = $_POST['titulo'];
      $evento->informacion_evento = $_POST['informacion_evento'];
      $evento->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;
      $evento->lugar_evento = $_POST['lugar_evento'];
      $evento->fecha_inicio = $_POST['fecha_inicio'];
      $evento->fecha_fin = $_POST['fecha_fin'];
      $evento->hora_inicio = $_POST['hora_inicio'];
      $evento->hora_fin = $_POST['hora_fin'];
      $evento->es_curso = isset($_POST['es_curso']) ? filter_var($_POST['es_curso'], FILTER_VALIDATE_BOOLEAN) : false;
      $evento->curso_id = !empty($_POST['curso_id']) ? intval($_POST['curso_id']) : null;  // Manejo del curso_id

      error_log("Datos recibidos en POST: " . print_r($_POST, true));
      error_log("Archivos recibidos: " . print_r($_FILES, true));

      // Crear o actualizar evento
      if ($isUpdate) {
          $result = $evento->update();
      } else {
          $result = $evento->create();
      }

        if ($result) {
            // Procesar imágenes y archivos después de crear/actualizar el evento
            if (!empty($_FILES['imagen_principal'])) {
                $evento->updateImagenPrincipal($_FILES['imagen_principal']);
            }
            if (!empty($_FILES['imagenes_generales']['name'][0])) {
                $evento->updateImagenesGenerales($_FILES['imagenes_generales']);
            }
            if (!empty($_FILES['archivos']['name'][0])) {
                $evento->updateArchivos($_FILES['archivos']);
            }

            http_response_code($isUpdate ? 200 : 201);
            echo json_encode(array(
                "message" => $isUpdate ? "Evento actualizado correctamente." : "Evento creado correctamente.",
                "id" => $evento->id
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar el evento." : "No se pudo crear el evento."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos."));
    }
    break;


    case 'GET':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if ($evento->readOne()) {
                $evento_arr = array(
                    "id" => $evento->id,
                    "titulo" => $evento->titulo,
                    "informacion_evento" => $evento->informacion_evento,
                    "activo" => $evento->activo,
                    "lugar_evento" => $evento->lugar_evento,
                    "fecha_inicio" => $evento->fecha_inicio,
                    "fecha_fin" => $evento->fecha_fin,
                    "hora_inicio" => $evento->hora_inicio,
                    "hora_fin" => $evento->hora_fin,
                    "imagen_principal" => $evento->imagen_principal,
                    "imagenes_generales" => $evento->getImagenesGenerales(),
                    "archivos" => $evento->getArchivos()
                );
                echo json_encode($evento_arr);
            }elseif (isset($_GET['recent'])) {
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
                $eventos_arr = $evento->readRecent($limit);
                if (!empty($eventos_arr)) {
                    echo json_encode(array("records" => $eventos_arr));
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No se encontraron eventos recientes."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Evento no encontrado."));
            }
        } else {
            $eventos_arr = $evento->read();
            if (!empty($eventos_arr)) {
                echo json_encode(array("records" => $eventos_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron eventos."));
            }
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
                if ($evento->activar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Evento activado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo activar el evento."));
                }
            } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
                if ($evento->desactivar()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Evento desactivado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo desactivar el evento."));
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del evento o la acción."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id']) && !isset($_GET['rutaArchivo'])) {
            // Eliminar un evento completo
            $evento->id = $_GET['id'];
            if ($evento->readOne()) {
                if (!empty($evento->imagen_principal) && file_exists("../" . $evento->imagen_principal)) {
                    unlink("../" . $evento->imagen_principal);
                }
                $imagenesGenerales = $evento->getImagenesGenerales();
                foreach ($imagenesGenerales as $imagen) {
                    if (file_exists("../" . $imagen)) {
                        unlink("../" . $imagen);
                    }
                }
                $archivos = $evento->getArchivos();
                foreach ($archivos as $archivo) {
                    if (file_exists("../" . $archivo['ruta_archivo'])) {
                        unlink("../" . $archivo['ruta_archivo']);
                    }
                }
                if ($evento->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Evento eliminado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar el evento."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Evento no encontrado."));
            }
        } else if (isset($_GET['eventoId']) && isset($_GET['rutaImagen'])) {
            // Eliminar una imagen general específica
            $evento->id = $_GET['eventoId'];
            $rutaImagen = $_GET['rutaImagen'];
            if ($evento->deleteImagenGeneral($rutaImagen)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imagen eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la imagen."));
            }
        } else if (isset($_GET['eventoId']) && isset($_GET['rutaArchivo'])) {
            // Eliminar un archivo específico
            $evento->id = $_GET['eventoId'];
            $rutaArchivo = $_GET['rutaArchivo'];
            if ($evento->deleteArchivo($rutaArchivo)) {
                http_response_code(200);
                echo json_encode(array("message" => "Archivo eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el archivo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del evento, la ruta de la imagen o la ruta del archivo."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
