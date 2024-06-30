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
        if (!empty($_POST['nombre']) && !empty($_POST['descripcion']) && !empty($_POST['competencia'])) {
            $taller->nombre = $_POST['nombre'];
            $taller->descripcion = $_POST['descripcion'];
            $taller->competencia = $_POST['competencia'];

            // Manejar la carga de la imagen
            if (!empty($_FILES['imagen']['tmp_name'])) {
                $target_dir = "../uploads/taller/";

                // Verificar si la carpeta existe, si no, crearla
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0777, true);
                }

                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen"]["name"]);
                $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                // Mover la imagen a la carpeta de destino
                if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
                    $taller->imagen = $target_file;

                    if ($taller->create()) {
                        http_response_code(201);
                        echo json_encode(array("message" => "Taller creado correctamente.", "id" => $taller->id));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "No se pudo crear el taller."));
                    }
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                }
            } else {
                if ($taller->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Taller creado correctamente.", "id" => $taller->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo crear el taller."));
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear el taller. Datos incompletos."));
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
                    "imagen" => $taller->imagen
                );
                echo json_encode($taller_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Taller no encontrado."));
            }
        } else {
            $stmt = $taller->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $talleres_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $taller_item = array(
                        "id" => $id,
                        "nombre" => $nombre,
                        "descripcion" => $descripcion,
                        "competencia" => $competencia,
                        "imagen" => $taller->getImagenTaller()
                    );
                    array_push($talleres_arr, $taller_item);
                }
                echo json_encode(array("records" => $talleres_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron talleres."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $taller->id = $data->id;
            $taller->nombre = $data->nombre;
            $taller->descripcion = $data->descripcion;
            $taller->competencia = $data->competencia;

            // Manejar la carga de la imagen solo si se proporciona una nueva imagen
            if (!empty($_FILES['imagen'])) {
                $target_dir = "../uploads/taller/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen"]["name"]);
                $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                // Mover la imagen a la carpeta de destino
                if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
                    // Eliminar la imagen anterior si existe
                    if (!empty($taller->imagen) && file_exists($taller->imagen)) {
                        unlink($taller->imagen);
                    }
                    $taller->imagen = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                    exit;
                }
            }

            if ($taller->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Taller actualizado correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar el taller."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar el taller. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $taller->id = $_GET['id'];
            if ($taller->readOne()) {
                // Eliminar la imagen del sistema de archivos
                if (!empty($taller->imagen) && file_exists($taller->imagen)) {
                    unlink($taller->imagen);
                }
                if ($taller->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Taller eliminado correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar el taller."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Taller no encontrado."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID del taller."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
