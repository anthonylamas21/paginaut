<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config/database.php';
require_once 'models/Carrera.php';

$database = new Database();
$db = $database->getConnection();

$carrera = new Carrera($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
  case 'POST':
    // Verificar si es una actualización o una creación
    $isUpdate = !empty($_POST['id']); // Comprobar si se ha proporcionado un ID

    if ($isUpdate) {
        $carrera->id = $_POST['id'];
        if (!$carrera->readOne()) {
            http_response_code(404);
            echo json_encode(array("message" => "Carrera no encontrada."));
            break;
        }
    }

    if (!empty($_POST['nombre_carrera']) && !empty($_POST['direccion_id']) && !empty($_POST['nivel_estudio_id']) && !empty($_POST['campo_estudio_id'])) {
        $carrera->nombre_carrera = $_POST['nombre_carrera'];
        $carrera->perfil_profesional = $_POST['perfil_profesional'];
        $carrera->ocupacion_profesional = $_POST['ocupacion_profesional'];
        $carrera->direccion_id = $_POST['direccion_id'];
        $carrera->nivel_estudio_id = $_POST['nivel_estudio_id'];
        $carrera->campo_estudio_id = $_POST['campo_estudio_id'];
        $carrera->activo = isset($_POST['activo']) ? filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN) : true;

        if (isset($_FILES['imagen_principal']) && $_FILES['imagen_principal']['error'] === UPLOAD_ERR_OK) {
            $carrera->imagen_principal = $_FILES['imagen_principal'];
        }

        if (isset($_FILES['imagenes_generales']) && !empty($_FILES['imagenes_generales']['name'][0])) {
            $carrera->imagenes_generales = $_FILES['imagenes_generales'];
        }

        if ($isUpdate) {
            $result = $carrera->update();
            $message = "Carrera actualizada correctamente.";
        } else {
            $result = $carrera->create();
            $message = "Carrera creada correctamente.";
        }

        if ($result) {
            http_response_code($isUpdate ? 200 : 201);
            echo json_encode(array(
                "message" => $message,
                "id" => $carrera->id
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => $isUpdate ? "No se pudo actualizar la carrera." : "No se pudo crear la carrera."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos."));
    }
    break;


    case 'GET':
      if (isset($_GET['id'])) {
          $carrera->id = $_GET['id'];
          if ($carrera->readOne()) {
              $carrera_arr = array(
                  "id" => $carrera->id,
                  "nombre_carrera" => $carrera->nombre_carrera,
                  "perfil_profesional" => $carrera->perfil_profesional,
                  "ocupacion_profesional" => $carrera->ocupacion_profesional,
                  "direccion_id" => $carrera->direccion_id,
                  "nivel_estudio_id" => $carrera->nivel_estudio_id,
                  "campo_estudio_id" => $carrera->campo_estudio_id,
                  "activo" => $carrera->activo,
                  "fecha_creacion" => $carrera->fecha_creacion,
                  "imagen_principal" => $carrera->getImagenPrincipal(),
                  "imagenes_generales" => $carrera->getImagenesGenerales()
              );
              echo json_encode($carrera_arr);
          } else {
              http_response_code(404);
              echo json_encode(array("message" => "Carrera no encontrada."));
          }
      } else {
          $carreras_arr = $carrera->read(); // Ya retorna el array de carreras con imágenes
          if ($carreras_arr) {
              echo json_encode(array("records" => $carreras_arr));
          } else {
              http_response_code(404);
              echo json_encode(array("message" => "No se encontraron carreras."));
          }
      }
      break;


  case 'PUT':
    if (isset($_GET['id'])) {
      $carrera->id = $_GET['id'];
      if (isset($_GET['accion']) && $_GET['accion'] == 'activar') {
        if ($carrera->updateStatus(true)) {
          http_response_code(200);
          echo json_encode(array("message" => "Carrera activada correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo activar la carrera."));
        }
      } elseif (isset($_GET['accion']) && $_GET['accion'] == 'desactivar') {
        if ($carrera->updateStatus(false)) {
          http_response_code(200);
          echo json_encode(array("message" => "Carrera desactivada correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo desactivar la carrera."));
        }
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó el ID de la carrera o la acción."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['id'])) {
      $carrera->id = $_GET['id'];
      if ($carrera->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Carrera eliminada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar la carrera."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó el ID de la carrera."));
    }
    break;

  default:
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido."));
    break;
}
?>
