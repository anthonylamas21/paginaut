<?php
require_once '../config/database.php';
require_once '../models/Cuatrimestre.php';
require_once '../models/Asignatura.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET['carreraId'])) {
            $cuatrimestre = new Cuatrimestre($db);
            $cuatrimestre->carrera_id = $_GET['carreraId'];

            $stmt = $cuatrimestre->readByCarrera();
            $cuatrimestres = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $asignatura = new Asignatura($db);
            $stmt = $asignatura->readAll();
            $asignaturasDisponibles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'cuatrimestres' => $cuatrimestres,
                'asignaturasDisponibles' => $asignaturasDisponibles
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        foreach ($data as $item) {
            $asignatura = new Asignatura($db);
            $asignatura->nombre = $item['asignaturaNombre'];
            $asignatura->cuatrimestre_id = $item['cuatrimestreId'];
            $asignatura->activo = true;
            $asignatura->create();
        }
        echo json_encode(["message" => "Asignaturas guardadas correctamente"]);
        break;

    // Otros métodos PUT, DELETE para actualizar o eliminar cuatrimestres
}
?>
