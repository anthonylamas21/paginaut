<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/Asignatura.php';

$database = new Database();
$db = $database->getConnection();

$asignatura = new Asignatura($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'POST':
        if (!empty($_POST['nombre']) && !empty($_POST['cuatrimestre_id'])) {
            $asignatura->nombre = $_POST['nombre'];
            $asignatura->cuatrimestre_id = $_POST['cuatrimestre_id'];
            $asignatura->activo = $_POST['activo'] ?? true;

            if (isset($_FILES['archivo_asociado'])) {
                $target_dir = "../uploads/asignaturas/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo_asociado"]["name"]);
                $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                if (move_uploaded_file($_FILES["archivo_asociado"]["tmp_name"], $target_file)) {
                    $asignatura->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo_asociado"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => $fileType
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($asignatura->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Asignatura creada correctamente.", "id" => $asignatura->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la asignatura."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la asignatura. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $asignatura->id = $_GET['id'];
            if ($asignatura->readOne()) {
                echo json_encode($asignatura);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Asignatura no encontrada."));
            }
        } else {
            $stmt = $asignatura->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $asignaturas_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $asignatura_item = array(
                        "id" => $id,
                        "nombre" => $nombre,
                        "cuatrimestre_id" => $cuatrimestre_id,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion,
                        "archivo_asociado" => $asignatura->getArchivoAsignatura($id)
                    );
                    array_push($asignaturas_arr, $asignatura_item);
                }
                echo json_encode($asignaturas_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron asignaturas."));
            }
        }
        break;

    case 'PUT':
        if (!empty($_POST['id'])) {
            $asignatura->id = $_POST['id'];
            $asignatura->nombre = $_POST['nombre'];
            $asignatura->cuatrimestre_id = $_POST['cuatrimestre_id'];
            $asignatura->activo = $_POST['activo'] ?? true;

            if (isset($_FILES['archivo_asociado'])) {
                $target_dir = "../uploads/asignaturas/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo_asociado"]["name"]);
                $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                if (move_uploaded_file($_FILES["archivo_asociado"]["tmp_name"], $target_file)) {
                    $asignatura->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo_asociado"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => $fileType
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($asignatura->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Asignatura actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la asignatura."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la asignatura. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $asignatura->id = $_GET['id'];
            if ($asignatura->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Asignatura eliminada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar la asignatura."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la asignatura."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
