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
        if (!empty($_POST['nombre']) && !empty($_POST['cuatrimestre_id'])) {
            // Verificar que el cuatrimestre existe
            $cuatrimestre->id = $_POST['cuatrimestre_id'];
            if (!$cuatrimestre->readOne()) {
                http_response_code(404);
                echo json_encode(array("message" => "Cuatrimestre no encontrado."));
                exit;
            }

            // Crear la asignatura
            $asignatura->nombre = $_POST['nombre'];
            $asignatura->cuatrimestre_id = $_POST['cuatrimestre_id'];
            $asignatura->activo = $_POST['activo'] ?? true;

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
        // Si se recibe un ID, obtener una asignatura específica
        if (isset($_GET['id'])) {
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

    // Otros métodos PUT, DELETE para actualizar o eliminar asignaturas
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>
