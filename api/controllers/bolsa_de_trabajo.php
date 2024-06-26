<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$root = dirname(__DIR__);  // Obtiene el directorio raíz del proyecto

include_once $root . '/config/database.php';
include_once $root . '/models/BolsaDeTrabajo.php';

$database = new Database();
$db = $database->getConnection();

$bolsa_de_trabajo = new BolsaDeTrabajo($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

switch($request_method) {
    case 'POST':
        if (!empty($data->titulo_trabajo) && !empty($data->informacion_oferta) && !empty($data->tipo)) {
            $bolsa_de_trabajo->titulo_trabajo = $data->titulo_trabajo;
            $bolsa_de_trabajo->informacion_oferta = $data->informacion_oferta;
            $bolsa_de_trabajo->correo_empresa = $data->correo_empresa;
            $bolsa_de_trabajo->tipo = $data->tipo;
            $bolsa_de_trabajo->telefono_empresa = $data->telefono_empresa;
            $bolsa_de_trabajo->id_direccion = $data->id_direccion;

            // Manejar la carga de la imagen
            if (!empty($_FILES["imagen"]["name"])) {
                $target_dir = "../uploads/bolsa_trabajo/imagenes/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen"]["name"]);
                if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
                    $bolsa_de_trabajo->imagen = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                    exit;
                }
            }

            // Manejar la carga de archivos
            if (!empty($_FILES["archivo_asociado"]["name"])) {
                $target_dir = "../uploads/bolsa_trabajo/archivos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo_asociado"]["name"]);
                if (move_uploaded_file($_FILES["archivo_asociado"]["tmp_name"], $target_file)) {
                    $bolsa_de_trabajo->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo_asociado"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => mime_content_type($target_file)
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($bolsa_de_trabajo->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Bolsa de trabajo creada correctamente.", "id" => $bolsa_de_trabajo->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la bolsa de trabajo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo crear la bolsa de trabajo. Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $bolsa_de_trabajo->id = $_GET['id'];
            if ($bolsa_de_trabajo->readOne()) {
                $bolsa_de_trabajo_arr = array(
                    "id" => $bolsa_de_trabajo->id,
                    "titulo_trabajo" => $bolsa_de_trabajo->titulo_trabajo,
                    "informacion_oferta" => $bolsa_de_trabajo->informacion_oferta,
                    "correo_empresa" => $bolsa_de_trabajo->correo_empresa,
                    "tipo" => $bolsa_de_trabajo->tipo,
                    "telefono_empresa" => $bolsa_de_trabajo->telefono_empresa,
                    "imagen" => $bolsa_de_trabajo->imagen,
                    "archivo_asociado" => $bolsa_de_trabajo->archivo_asociado,
                    "activo" => $bolsa_de_trabajo->activo,
                    "id_direccion" => $bolsa_de_trabajo->id_direccion,
                    "fecha_creacion" => $bolsa_de_trabajo->fecha_creacion
                );
                echo json_encode($bolsa_de_trabajo_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
            }
        } else {
            $stmt = $bolsa_de_trabajo->read();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $bolsa_de_trabajo_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $bolsa_de_trabajo_item = array(
                        "id" => $id,
                        "titulo_trabajo" => $titulo_trabajo,
                        "informacion_oferta" => $informacion_oferta,
                        "correo_empresa" => $correo_empresa,
                        "tipo" => $tipo,
                        "telefono_empresa" => $telefono_empresa,
                        "imagen" => $bolsa_de_trabajo->getImagenBolsaDeTrabajo(),
                        "archivo_asociado" => $bolsa_de_trabajo->getArchivoBolsaDeTrabajo(),
                        "activo" => $activo,
                        "id_direccion" => $id_direccion,
                        "fecha_creacion" => $fecha_creacion
                    );
                    array_push($bolsa_de_trabajo_arr, $bolsa_de_trabajo_item);
                }
                echo json_encode(array("records" => $bolsa_de_trabajo_arr));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron bolsas de trabajo."));
            }
        }
        break;

    case 'PUT':
        if (!empty($data->id)) {
            $bolsa_de_trabajo->id = $data->id;
            $bolsa_de_trabajo->titulo_trabajo = $data->titulo_trabajo;
            $bolsa_de_trabajo->informacion_oferta = $data->informacion_oferta;
            $bolsa_de_trabajo->correo_empresa = $data->correo_empresa;
            $bolsa_de_trabajo->tipo = $data->tipo;
            $bolsa_de_trabajo->telefono_empresa = $data->telefono_empresa;
            $bolsa_de_trabajo->activo = $data->activo;
            $bolsa_de_trabajo->id_direccion = $data->id_direccion;

            // Manejar la carga de la imagen solo si se proporciona una nueva imagen
            if (!empty($_FILES["imagen"]["name"])) {
                $target_dir = "../uploads/bolsa_trabajo/imagenes/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen"]["name"]);
                if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
                    // Eliminar la imagen anterior si existe
                    if (!empty($bolsa_de_trabajo->imagen) && file_exists($bolsa_de_trabajo->imagen)) {
                        unlink($bolsa_de_trabajo->imagen);
                    }
                    $bolsa_de_trabajo->imagen = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen."));
                    exit;
                }
            }

            // Manejar la carga de archivos solo si se proporciona un nuevo archivo
            if (!empty($_FILES["archivo_asociado"]["name"])) {
                $target_dir = "../uploads/bolsa_trabajo/archivos/";
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["archivo_asociado"]["name"]);
                if (move_uploaded_file($_FILES["archivo_asociado"]["tmp_name"], $target_file)) {
                    // Eliminar el archivo anterior si existe
                    if (!empty($bolsa_de_trabajo->archivo_asociado['ruta_archivo']) && file_exists($bolsa_de_trabajo->archivo_asociado['ruta_archivo'])) {
                        unlink($bolsa_de_trabajo->archivo_asociado['ruta_archivo']);
                    }
                    $bolsa_de_trabajo->archivo_asociado = array(
                        'nombre_archivo' => basename($_FILES["archivo_asociado"]["name"]),
                        'ruta_archivo' => $target_file,
                        'tipo_archivo' => mime_content_type($target_file)
                    );
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar el archivo."));
                    exit;
                }
            }

            if ($bolsa_de_trabajo->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Bolsa de trabajo actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la bolsa de trabajo."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se pudo actualizar la bolsa de trabajo. Datos incompletos."));
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $bolsa_de_trabajo->id = $_GET['id'];
            if ($bolsa_de_trabajo->readOne()) {
                // Eliminar la imagen del sistema de archivos
                if (!empty($bolsa_de_trabajo->imagen) && file_exists($bolsa_de_trabajo->imagen)) {
                    unlink($bolsa_de_trabajo->imagen);
                }
                // Eliminar el archivo del sistema de archivos
                if (!empty($bolsa_de_trabajo->archivo_asociado['ruta_archivo']) && file_exists($bolsa_de_trabajo->archivo_asociado['ruta_archivo'])) {
                    unlink($bolsa_de_trabajo->archivo_asociado['ruta_archivo']);
                }
                if ($bolsa_de_trabajo->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Bolsa de trabajo eliminada correctamente."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo eliminar la bolsa de trabajo."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la bolsa de trabajo."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
