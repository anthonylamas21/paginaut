<?php
require_once 'config/database.php';
require_once 'models/Cuatrimestre.php';

$database = new Database();
$db = $database->getConnection();

$cuatrimestre = new Cuatrimestre($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        if (!empty($_POST['numero']) && !empty($_POST['carrera_id'])) {
            $cuatrimestre->numero = $_POST['numero'];
            $cuatrimestre->carrera_id = $_POST['carrera_id'];
            $cuatrimestre->activo = $_POST['activo'] ?? true;

            if ($cuatrimestre->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Cuatrimestre creado correctamente."));
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
        if (isset($_GET['carrera_id'])) {
            $cuatrimestre->carrera_id = $_GET['carrera_id'];
            $stmt = $cuatrimestre->readByCarrera();
            $cuatrimestres = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($cuatrimestres);
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se proporcionó el ID de la carrera."));
        }
        break;

    // Otros métodos PUT, DELETE para actualizar o eliminar cuatrimestres
}
?>
