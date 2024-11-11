<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config/database.php';
require_once 'models/Curso.php';

$database = new Database();
$db = $database->getConnection();

$curso = new Curso($db);

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method == 'OPTIONS') {
  // Enviar una respuesta de éxito para las solicitudes OPTIONS (preflight request)
  http_response_code(200);
  exit();
}

switch ($request_method) {
  case 'POST':
    $isUpdate = isset($_GET['id']);
    
    if (isset($_POST['nombre'])) {
      $curso->nombre = $_POST['nombre'];
      $curso->descripcion = $_POST['descripcion'];
      $curso->activo = filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN);
      
      $curso->imagen_principal = isset($_FILES['imagen_principal']) ? $_FILES['imagen_principal'] : null;
      $curso->imagenes_generales = isset($_FILES['imagenes_generales']) ? $_FILES['imagenes_generales'] : [];

      // Procesar imágenes generales a eliminar
      $curso->imagenesGeneralesAEliminar = isset($_POST['imagenes_a_eliminar']) ? json_decode($_POST['imagenes_a_eliminar'], true) : [];

      if ($isUpdate) {
        $curso->id = $_GET['id'];
        if ($curso->update()) {
          $curso->eliminarProfesores();
          if (isset($_POST['profesores'])) {
            $profesores = json_decode($_POST['profesores'], true);
            foreach ($profesores as $profesor_id) {
              $curso->asignarProfesor($profesor_id);
            }
          }
          http_response_code(200);
          echo json_encode(array("message" => "Curso actualizado correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo actualizar el curso."));
        }
      } else {
        if ($curso->create()) {
          if (isset($_POST['profesores'])) {
            $profesores = json_decode($_POST['profesores'], true);
            foreach ($profesores as $profesor_id) {
              $curso->asignarProfesor($profesor_id);
            }
          }
          http_response_code(201);
          echo json_encode(array("message" => "Curso creado correctamente.", "id" => $curso->id));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo crear el curso."));
        }
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $curso->id = $_GET['id'];
      if ($curso->readOne()) {
        $curso_arr = array(
          "id" => $curso->id,
          "nombre" => $curso->nombre,
          "descripcion" => $curso->descripcion,
          "activo" => $curso->activo,
          "fecha_creacion" => $curso->fecha_creacion,
          "imagen_principal" => $curso->imagen_principal,
          "imagenes_generales" => $curso->getImagenesGenerales()
        );
        echo json_encode($curso_arr);
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Curso no encontrado."));
      }
    } else {
      $cursos_arr = $curso->read();
      if (!empty($cursos_arr)) {
        echo json_encode(array("records" => $cursos_arr));
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "No se encontraron cursos."));
      }
    }
    break;

    case 'PUT':
      if (isset($_GET['id'])) {
        $curso->id = $_GET['id'];

        // Acceder a 'accion' desde $_GET porque es un parámetro en la URL, no en el cuerpo de la solicitud.
        if (isset($_GET['accion']) && $_GET['accion'] === 'desactivar') {
          if ($curso->desactivar()) {
              http_response_code(200);
              echo json_encode(array("message" => "Curso desactivado correctamente."));
          } else {
              http_response_code(503);
              echo json_encode(array("message" => "No se pudo desactivar el curso."));
          }
        }elseif(isset($_GET['accion']) && $_GET['accion'] === 'activar'){
          if ($curso->activar()) {
            http_response_code(200);
            echo json_encode(array("message" => "Curso desactivado correctamente."));
          } else {
              http_response_code(503);
              echo json_encode(array("message" => "No se pudo desactivar el curso."));
          }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Acción no especificada o incorrecta."));
        }
      }else{
        http_response_code(400);
        echo json_encode(array("message" => "No se proporcionó el ID"));
      }
      break;

    case 'DELETE':
      if(isset($_GET['id']) && isset($_GET['accion']) && $_GET['accion'] === 'remover'){
        $curso->id = $_GET['id'];
        if ($curso->delete()) {
          http_response_code(200);
          echo json_encode(array("message" => "Curso eliminado correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo eliminar el curso."));
        }
      }elseif (isset($_GET['cursoId']) && isset($_GET['rutaImagen'])) {
        $curso->id = $_GET['cursoId'];
        $rutaImagen = $_GET['rutaImagen'];
        if ($curso->deleteImagenGeneral($rutaImagen)) {
          http_response_code(200);
          echo json_encode(array("message" => "Imagen eliminada correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo eliminar la imagen."));
        }
      } else {
        http_response_code(400);
        echo json_encode(array("message" => "No se proporcionó el ID del curso o la ruta de la imagen."));
      }
      break;
  
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
