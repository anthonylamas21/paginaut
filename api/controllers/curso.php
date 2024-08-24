<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php'; // Subí un nivel porque estás en 'controllers'
require_once '../models/Curso.php';    // Subí un nivel porque estás en 'controllers'

$database = new Database();
$db = $database->getConnection();

$curso = new Curso($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
  case 'POST':
    $isUpdate = isset($_GET['id']);
    
    if (isset($_POST['nombre'])) {
      $curso->nombre = $_POST['nombre'];
      $curso->descripcion = $_POST['descripcion'];
      $curso->activo = filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN);
      
      $imagenPrincipal = null;
      $imagenesGenerales = [];
      
      // Verificar si la clave imagen_principal está en $_FILES
      if (isset($_FILES['imagen_principal'])) {
          $imagenPrincipal = $_FILES['imagen_principal'];
      }

      // Verificar si la clave imagenes_generales está en $_FILES
      if (isset($_FILES['imagenes_generales'])) {
          $imagenesGenerales = $_FILES['imagenes_generales'];
      }
   
      $curso->imagen_principal = $imagenPrincipal;
      $curso->imagenes_generales = $imagenesGenerales;
       

      if ($curso->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Curso creado correctamente.", "id" => $curso->id)); // Retorna el ID
      } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo crear el Curso."));
      }
    
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }

    if ($isUpdate) {
      $curso->id = $_GET['id'];
      if (!$curso->readOne()) {
        http_response_code(404);
        echo json_encode(array("message" => "Curso no encontrado."));
        break;
      }
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
        echo json_encode(array("message" => "No se encontraron Cursos."));
      }
    }
    break;
    
    case 'PUT':
      if (isset($_GET['id'])) {
          $id = $_GET['id'];
          $curso->id = $id;
  
          // Decodificar el cuerpo de la solicitud para obtener los datos
          $data = json_decode(file_get_contents("php://input"));
  
          // Validar y asignar los valores desde $data
          if (isset($data->nombre) && isset($data->descripcion)) {
              $curso->nombre = $data->nombre;
              $curso->descripcion = $data->descripcion;
          } else {
              http_response_code(400);
              echo json_encode(array("message" => "Datos incompletos: nombre y descripción son obligatorios."));
              break;
          }
  
          // Asegurar que activo sea un booleano
          $curso->activo = isset($data->activo) ? filter_var($data->activo, FILTER_VALIDATE_BOOLEAN) : false;
  
          // Manejar imágenes (verificar que los archivos se envían correctamente)
          $imagenPrincipal = null;
          $imagenesGenerales = [];
  
          if (isset($_FILES['imagen_principal'])) {
              $imagenPrincipal = $_FILES['imagen_principal'];
          }
  
          if (isset($_FILES['imagenes_generales'])) {
              $imagenesGenerales = $_FILES['imagenes_generales'];
          }
  
          $curso->imagen_principal = $imagenPrincipal;
          $curso->imagenes_generales = $imagenesGenerales;
  
          // Actualizar el curso y luego manejar la asignación de profesores
          if ($curso->update()) {
              // Elimina los profesores existentes antes de reasignar
              $curso->eliminarProfesores();
  
              // Reasignar los profesores seleccionados
              if (isset($data->profesores)) {
                  foreach ($data->profesores as $profesor_id) {
                      $curso->asignarProfesor($profesor_id);
                  }
              }
  
              http_response_code(200);
              echo json_encode(array("message" => "Curso actualizado correctamente."));
          } else {
              http_response_code(503);
              echo json_encode(array("message" => "No se pudo actualizar el Curso."));
          }
      } else {
          http_response_code(400);
          echo json_encode(array("message" => "Datos incompletos."));
      }
      break;
  
  
  case 'DELETE':
    if (isset($_GET['id']) && !isset($_GET['rutaImagen'])) {
      $curso->id = $_GET['id'];
      if ($curso->readOne()) {
        if (!empty($curso->imagen_principal) && file_exists("../" . $curso->imagen_principal)) {
          unlink("../" . $curso->imagen_principal);
        }
        $imagenesGenerales = $curso->getImagenesGenerales();
        foreach ($imagenesGenerales as $imagen) {
          if (file_exists("../" . $imagen)) {
            unlink("../" . $imagen);
          }
        }
        if ($curso->delete()) {
          http_response_code(200);
          echo json_encode(array("message" => "Curso eliminado correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo eliminar el Curso."));
        }
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Curso no encontrado."));
      }
    } else if (isset($_GET['cursoId']) && isset($_GET['rutaImagen'])) {
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
}
