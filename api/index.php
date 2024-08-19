<?php
// Configurar la zona horaria a America/Mazatlan
date_default_timezone_set('America/Mazatlan');

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Definir las rutas disponibles en la API
$request_method = $_SERVER["REQUEST_METHOD"];
$request_uri = $_SERVER['REQUEST_URI'];

switch ($request_method) {
    case 'POST':
    case 'GET':
    case 'PUT':
    case 'DELETE':
        if (strpos($request_uri, '/api/usuario') !== false) {
            include_once 'controllers/usuario.php';
        } elseif (strpos($request_uri, '/api/rol') !== false) {
            include_once 'controllers/rol.php';
        } elseif (strpos($request_uri, '/api/departamento') !== false) {
            include_once 'controllers/departamento.php';
        } elseif (strpos($request_uri, '/api/direccion') !== false) {
            include_once 'controllers/direccion.php';
        } elseif (strpos($request_uri, '/api/carrera') !== false) {
            include_once 'controllers/carrera.php';
        } elseif (strpos($request_uri, '/api/cuatrimestre') !== false) {
            include_once 'controllers/cuatrimestre.php';
        } elseif (strpos($request_uri, '/api/asignatura') !== false) {
            include_once 'controllers/asignatura.php';
        } elseif (strpos($request_uri, '/api/evento') !== false) {
            include_once 'controllers/evento.php';
        } elseif (strpos($request_uri, '/api/imagenevento') !== false) {
            include_once 'controllers/imagenevento.php';
        } elseif (strpos($request_uri, '/api/taller') !== false) {
            include_once 'controllers/taller.php';
        } elseif (strpos($request_uri, '/api/bolsa_de_trabajo') !== false) {
            include_once 'controllers/bolsa_de_trabajo.php';
        } elseif (strpos($request_uri, '/api/login') !== false) {
            include_once 'controllers/login.php';
        } elseif (strpos($request_uri, '/api/logout') !== false) {
            include_once 'controllers/logout.php';
        } elseif (strpos($request_uri, '/api/recover_password') !== false) {
            include_once 'controllers/recover_password.php';
        } elseif (strpos($request_uri, '/api/reset_password') !== false) {
            include_once 'controllers/reset_password.php';
        } elseif (strpos($request_uri, '/api/deleteToken') !== false) {
            include_once 'controllers/deleteToken.php';
        } elseif (strpos($request_uri, '/api/talleres') !== false) {
            include_once 'controllers/taller.php';
        } elseif (strpos($request_uri, '/api/calendario') !== false) {
            include_once 'controllers/calendario.php';
        } elseif (strpos($request_uri, '/api/beca') !== false) {
            include_once 'controllers/beca.php';
        } elseif (strpos($request_uri, '/api/noticia') !== false) {
            include_once 'controllers/noticia.php';
        } elseif (strpos($request_uri, '/api/instalacion') !== false) {
            include_once 'controllers/instalacion.php';
        } elseif (strpos($request_uri, '/api/status') !== false) {
            header('Content-Type: application/json');
            echo json_encode(array("message" => "API is working."));
        } elseif (strpos($request_uri, '/api/niveles-estudios') !== false) { // Nueva ruta para NivelesEstudios
            include_once 'controllers/NivelesEstudiosController.php';
        } elseif (strpos($request_uri, '/api/campo-estudio') !== false) { // Nueva ruta para CampoEstudio
            include_once 'controllers/CampoEstudioController.php';
        }elseif (strpos($request_uri, '/api/cuatrimestre') !== false) {
            include_once 'controllers/cuatrimestre.php';
        } elseif (strpos($request_uri, '/api/asignaturas') !== false) {
            include_once 'controllers/asignatura.php';
        } // Manejo de la ruta /api/cuatrimestres/carrera/{carrera_id}/asignaturas
        elseif (strpos($request_uri, '/api/cuatrimestres/carrera/') !== false && $_SERVER['REQUEST_METHOD'] == 'GET') {
            include_once 'controllers/cuatrimestre.php';
        }
        elseif (strpos($request_uri, '/api/send_reset_email') !== false) {
            include_once 'controllers/send_reset_email.php';
        } else {

            header("HTTP/1.0 404 Not Found");
            echo json_encode(array("message" => "Endpoint not found."));
        }

        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
