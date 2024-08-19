<?php
require_once 'config/database.php';
require_once 'models/Cuatrimestre.php';

$database = new Database();
$db = $database->getConnection();

$cuatrimestre = new Cuatrimestre($db);

$request_method = $_SERVER["REQUEST_METHOD"];
$request_uri = $_SERVER['REQUEST_URI'];

switch ($request_method) {
    case 'POST':
        // Si estás enviando como JSON
        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->numero) && !empty($data->carrera_id)) {
            $cuatrimestre->numero = $data->numero;
            $cuatrimestre->carrera_id = $data->carrera_id;
            $cuatrimestre->activo = isset($data->activo) ? $data->activo : true;

            // En el controlador de cuatrimestre, después de crear el cuatrimestre:
            if ($cuatrimestre->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Cuatrimestre creado correctamente.",
                    "id" => $cuatrimestre->id // Devolver el ID del cuatrimestre creado
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "No se pudo crear el cuatrimestre."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
        }
        break;

    case 'GET':
        // Extraer carrera_id de la URL
        if (preg_match('/\/api\/cuatrimestres\/carrera\/(\d+)\/asignaturas/', $request_uri, $matches)) {
            $carreraId = $matches[1]; // El ID de la carrera capturado de la URL

            $result = $cuatrimestre->getCuatrimestresYAsignaturas($carreraId);

            if (!empty($result)) {
                http_response_code(200);
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron cuatrimestres o asignaturas para la carrera proporcionada."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la carrera."));
        }
        break;

    // Otros métodos PUT, DELETE para actualizar o eliminar cuatrimestres
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
