<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Evento.php';

$database = new Database();
$db = $database->getConnection();

$evento = new Evento($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        if (!empty($_POST['titulo']) && !empty($_POST['informacion_evento']) && !empty($_POST['tipo']) && !empty($_POST['lugar_evento'])) {
            $evento->titulo = $_POST['titulo'];
            $evento->informacion_evento = $_POST['informacion_evento'];
            $evento->tipo = $_POST['tipo'];
            $evento->lugar_evento = $_POST['lugar_evento'];
            $evento->fecha_inicio = $_POST['fecha_inicio'];
            $evento->fecha_fin = $_POST['fecha_fin'];
            $evento->hora_inicio = $_POST['hora_inicio'];
            $evento->hora_fin = $_POST['hora_fin'];

            // Manejar la carga de la imagen
            if (!empty($_FILES["imagen_evento"]["name"])) {
                $target_dir = "../uploads/eventos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen_evento"]["name"]);
                if (move_uploaded_file($_FILES["imagen_evento"]["tmp_name"], $target_file)) {
                    $evento->imagen_evento = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                    exit;
                }
            }

            // Manejar la carga de archivos
            if (!empty($_FILES["archivo"]["name"])) {
                $target_dir = "../uploads/archivos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo"]["name"]);
                if (move_uploaded_file($_FILES["archivo"]["tmp_name"], $target_file)) {
                    $evento->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => $_FILES["archivo"]["type"]
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($evento->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Evento creado correctamente.", "id" => $evento->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el evento. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if ($evento->readOne()) {
                echo json_encode(array(
                    "id" => $evento->id,
                    "titulo" => $evento->titulo,
                    "informacion_evento" => $evento->informacion_evento,
                    "tipo" => $evento->tipo,
                    "imagen_evento" => $evento->imagen_evento,
                    "lugar_evento" => $evento->lugar_evento,
                    "fecha_inicio" => $evento->fecha_inicio,
                    "fecha_fin" => $evento->fecha_fin,
                    "hora_inicio" => $evento->hora_inicio,
                    "hora_fin" => $evento->hora_fin,
                    "archivo_asociado" => $evento->archivo_asociado,
                    "activo" => $evento->activo,
                    "fecha_creacion" => $evento->fecha_creacion
                ));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Evento no encontrado."));
            }
        } else {
            $stmt = $evento->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $eventos_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $evento_item = array(
                        "id" => $id,
                        "titulo" => $titulo,
                        "informacion_evento" => $informacion_evento,
                        "tipo" => $tipo,
                        "imagen_evento" => $evento->getImagenEvento(),
                        "lugar_evento" => $lugar_evento,
                        "fecha_inicio" => $fecha_inicio,
                        "fecha_fin" => $fecha_fin,
                        "hora_inicio" => $hora_inicio,
                        "hora_fin" => $hora_fin,
                        "archivo_asociado" => $evento->getArchivoEvento(),
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($eventos_arr, $evento_item);
                }
                echo json_encode(array("records" => $eventos_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron eventos."));
            }
        }
        break;

    case 'PUT':
        if (!empty($_POST['id'])) {
            $evento->id = $_POST['id'];
            $evento->titulo = $_POST['titulo'];
            $evento->informacion_evento = $_POST['informacion_evento'];
            $evento->tipo = $_POST['tipo'];
            $evento->lugar_evento = $_POST['lugar_evento'];
            $evento->fecha_inicio = $_POST['fecha_inicio'];
            $evento->fecha_fin = $_POST['fecha_fin'];
            $evento->hora_inicio = $_POST['hora_inicio'];
            $evento->hora_fin = $_POST['hora_fin'];
            $evento->activo = $_POST['activo'];

            // Manejar la carga de la imagen solo si se proporciona una nueva imagen
            if (!empty($_FILES["imagen_evento"]["name"])) {
                $target_dir = "../uploads/eventos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen_evento"]["name"]);
                if (move_uploaded_file($_FILES["imagen_evento"]["tmp_name"], $target_file)) {
                    // Eliminar la imagen anterior si existe
                    if (!empty($evento->imagen_evento) && file_exists($evento->imagen_evento)) {
                        unlink($evento->imagen_evento);
                    }
                    $evento->imagen_evento = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                    exit;
                }
            }

            // Manejar la carga de archivos
            if (!empty($_FILES["archivo"]["name"])) {
                $target_dir = "../uploads/archivos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo"]["name"]);
                if (move_uploaded_file($_FILES["archivo"]["tmp_name"], $target_file)) {
                    $evento->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => $_FILES["archivo"]["type"]
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($evento->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Evento actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el evento."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el evento. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $evento->id = $_GET['id'];
            if ($evento->readOne()) {
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
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del evento."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
