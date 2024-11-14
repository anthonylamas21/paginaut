<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(dirname(__DIR__) . '/config/database.php');
require_once(dirname(__DIR__) . '/models/CursoMaestro.php');

$database = new Database();
$db = $database->getConnection();

$curso_maestro = new CursoMaestro($db);

$request_method = $_SERVER["REQUEST_METHOD"];

// Obtener datos de la solicitud
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
    case 'POST':
        if (!empty($data) && is_array($data)) {
            $success = true;
            foreach ($data as $profesor) {
                if (isset($profesor->profesor_id) && isset($profesor->curso_id)) {
                    $curso_maestro->profesor_id = $profesor->profesor_id;
                    $curso_maestro->curso_id = $profesor->curso_id;
                    $curso_maestro->activo = $profesor->activo;
                    if (!$curso_maestro->create()) {
                        $success = false;
                        break;
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "Datos incompletos en uno de los objetos."));
                    exit;
                }
            }
            if ($success) {
                http_response_code(201);
                echo json_encode(array("message" => "Profesores asignados correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo asignar uno o más profesores."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos inválidos o vacíos."));
        }
        break;

  case 'GET':
    if (isset($_GET['profesor_id'])) {
      $curso_maestro->profesor_id = $_GET['profesor_id'];
      echo json_encode(array("tipos" => $curso_maestro->read()));
    
    } elseif (isset($_GET['curso_id'])) {
        $curso_maestro->curso_id = $_GET['curso_id'];
        $profesores = $curso_maestro->obtenerProfesoresPorCurso();
        echo json_encode(['profesores' => $profesores]);
    
    }else{
        http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID"));
    }


    break;

    case 'DELETE':
        if (isset($_GET['curso_id'])) {
            $curso_maestro->curso_id = $_GET['curso_id'];
            if ($curso_maestro->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Profesores eliminados correctamente."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo eliminar los profesores."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó un ID de curso."));
        }
        break;
}
