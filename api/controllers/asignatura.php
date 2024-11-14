<?php
require_once 'config/database.php';
require_once 'models/Asignatura.php';
require_once 'models/Cuatrimestre.php';

$database = new Database();
$db = $database->getConnection();

$asignatura = new Asignatura($db);
$cuatrimestre = new Cuatrimestre($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        // Obtener datos de la solicitud en formato JSON
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->nombre) && !empty($data->cuatrimestre_id)) {
            // Verificar que el cuatrimestre existe
            $cuatrimestre->id = $data->cuatrimestre_id;
            if (!$cuatrimestre->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Cuatrimestre no encontrado."));
                exit;
            }

            // Crear la asignatura
            $asignatura->nombre = $data->nombre;
            $asignatura->cuatrimestre_id = $data->cuatrimestre_id;
            $asignatura->activo = $data->activo ?? true;

            if ($asignatura->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Asignatura creada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear la asignatura."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener una asignatura específica
            $asignatura->id = $_GET['id'];
            if ($asignatura->readOne()) {
                echo json_encode($asignatura);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Asignatura no encontrada."));
            }
        } else {
            // Obtener todas las asignaturas
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
                        "fecha_creacion" => $fecha_creacion
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
        // Actualizar una asignatura
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->id) && !empty($data->nombre) && !empty($data->cuatrimestre_id)) {
            $asignatura->id = $data->id;

            // Verificar que la asignatura existe
            if (!$asignatura->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Asignatura no encontrada."));
                exit;
            }

            // Actualizar la asignatura
            $asignatura->nombre = $data->nombre;
            $asignatura->cuatrimestre_id = $data->cuatrimestre_id;
            $asignatura->activo = $data->activo ?? true;

            if ($asignatura->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Asignatura actualizada correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo actualizar la asignatura."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

        case 'DELETE':
          // Obtener datos de la solicitud en formato JSON
          $data = json_decode(file_get_contents("php://input"));

          // Verifica si el ID está presente en el cuerpo de la solicitud
          if (!empty($data->id) && is_numeric($data->id)) {
              $asignatura->id = intval($data->id); // Convertir a entero
              error_log("ID recibido para eliminación: " . $asignatura->id); // Log para depuración

              // Intenta eliminar la asignatura
              if ($asignatura->delete()) {
                  http_response_code(200);
                  echo json_encode(array("message" => "Asignatura eliminada."));
              } else {
                  http_response_code(503);
                  echo json_encode(array("message" => "No se pudo eliminar la asignatura."));
              }
          } else {
              error_log("No se recibió un ID válido para eliminación"); // Log si no se recibe un ID
              http_response_code(400);
              echo json_encode(array("message" => "Datos incompletos. Falta el ID."));
          }
          break;





    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
