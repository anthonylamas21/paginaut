<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

require_once $root . '/config/database.php';
require_once $root . '/models/Calendario.php';

$database = new Database();
$db = $database->getConnection();

$calendario = new Calendario($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        if (isset($_POST['id'])) {
            $calendario->id = $_POST['id'];
            $calendario->titulo = $_POST['titulo'];
            $calendario->activo = $_POST['activo'] === 'true' ? true : false;

            if (!empty($_FILES['archivo']['tmp_name'])) {
                $target_dir = "../uploads/calendario/";
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0777, true);
                }
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo"]["name"]);
                if (move_uploaded_file($_FILES["archivo"]["tmp_name"], $target_file)) {
                    $calendario->archivo = $target_file;
                }
            } else {
                $calendario->archivo = $_POST['archivo'];
            }

            if ($calendario->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Calendario actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el calendario."));
            }
        } else {
            if (!empty($_POST['titulo'])) {
                $calendario->titulo = $_POST['titulo'];
                $calendario->activo = true;

                if (!empty($_FILES['archivo']['tmp_name'])) {
                    $target_dir = "../uploads/calendario/";
                    if (!file_exists($target_dir)) {
                        mkdir($target_dir, 0777, true);
                    }
                    $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo"]["name"]);
                    if (move_uploaded_file($_FILES["archivo"]["tmp_name"], $target_file)) {
                        $calendario->archivo = $target_file;
                    }
                }

                if ($calendario->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Calendario creado correctamente.", "id" => $calendario->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo crear el calendario."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "No se pudo crear el calendario. Datos incompletos."));
            }
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $calendario->id = $_GET['id'];
            if ($calendario->readOne()) {
                echo json_encode($calendario);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Calendario no encontrado."));
            }
        } else {
            $stmt = $calendario->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $calendarios_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $calendario_item = array(
                        "id" => $id,
                        "titulo" => $titulo,
                        "archivo" => $archivo,
                        "activo" => $activo,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($calendarios_arr, $calendario_item);
                }
                echo json_encode(array("records" => $calendarios_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron calendarios."));
            }
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $calendario->id = $_GET['id'];
            if ($calendario->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Calendario eliminado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar el calendario."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del calendario."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
