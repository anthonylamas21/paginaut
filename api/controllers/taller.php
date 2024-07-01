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

            // Manejar la carga de la imagen principal
            if (!empty($_FILES['imagen_principal']['tmp_name'])) {
                $target_dir = "../uploads/taller/";
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0777, true);
                }
                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen_principal"]["name"]);
                $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                if (move_uploaded_file($_FILES["imagen_principal"]["tmp_name"], $target_file)) {
                    $taller->imagen = $target_file;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se pudo cargar la imagen principal."));
                    exit;
                }
            }

            // Crear taller y guardar la imagen principal
            if ($taller->create()) {
                // Manejar la carga de imágenes generales
                if (!empty($_FILES['imagenes_generales']['tmp_name'])) {
                    foreach ($_FILES['imagenes_generales']['tmp_name'] as $key => $tmp_name) {
                        $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagenes_generales"]["name"][$key]);
                        if (move_uploaded_file($tmp_name, $target_file)) {
                            $taller->saveImagenGeneral($target_file);
                        }
                    }
                }

                http_response_code(201);
                echo json_encode(array("message" => "Taller creado correctamente.", "id" => $taller->id));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el taller."));
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
                        "imagen" => $taller->imagen,
                        "imagenesGenerales" => $taller->getImagenesGenerales()
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
                    echo json_encode(array("message" => "No se encontraron talleres."));
                }
            }
            break;
        

            case 'PUT':
                parse_str(file_get_contents("php://input"), $post_vars);
        
                // Combinar los datos POST y FILES
                $_POST = array_merge($_POST, $post_vars);
        
                if (!empty($_POST['id']) && !empty($_POST['nombre']) && !empty($_POST['descripcion']) && !empty($_POST['competencia'])) {
                    $taller->id = $_POST['id'];
                    $taller->nombre = $_POST['nombre'];
                    $taller->descripcion = $_POST['descripcion'];
                    $taller->competencia = $_POST['competencia'];
        
                    $nuevaImagenPrincipal = null;
                    $nuevasImagenesGenerales = [];
                    $imagenesGeneralesAEliminar = [];
        
                    // Manejar la carga de la imagen principal si se proporciona
                    if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
                        $target_dir = "../uploads/taller/";
                        $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagen_principal"]["name"]);
                        if (move_uploaded_file($_FILES["imagen_principal"]["tmp_name"], $target_file)) {
                            $nuevaImagenPrincipal = $target_file;
                        }
                    }
        
                    // Manejar nuevas imágenes generales
                    if (isset($_FILES['imagenes_generales'])) {
                        $fileCount = count($_FILES['imagenes_generales']['name']);
                        for ($i = 0; $i < $fileCount; $i++) {
                            if ($_FILES['imagenes_generales']['error'][$i] === UPLOAD_ERR_OK) {
                                $target_file = $target_dir . uniqid() . "_" . basename($_FILES["imagenes_generales"]["name"][$i]);
                                if (move_uploaded_file($_FILES["imagenes_generales"]["tmp_name"][$i], $target_file)) {
                                    $nuevasImagenesGenerales[] = $target_file;
                                }
                            }
                        }
                    }
        
                    // Imágenes generales a eliminar
                    if (!empty($_POST['imagenes_generales_actuales'])) {
                        $imagenesGeneralesActuales = json_decode($_POST['imagenes_generales_actuales'], true);
                        $imagenesGeneralesAEliminar = array_diff($taller->getImagenesGenerales(), $imagenesGeneralesActuales);
                    }
        
                    if ($taller->update($nuevaImagenPrincipal, $nuevasImagenesGenerales, $imagenesGeneralesAEliminar)) {
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