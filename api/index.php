<?php
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
        } elseif (strpos($request_uri, '/api/rol') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con los roles
            include_once 'controllers/rol.php';
        } elseif (strpos($request_uri, '/api/departamento') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con los departamentos
            include_once 'controllers/departamento.php';
        } elseif (strpos($request_uri, '/api/direccion') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/direccion.php';
        } elseif (strpos($request_uri, '/api/carrera') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/carrera.php';
        } elseif (strpos($request_uri, '/api/cuatrimestre') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/cuatrimestre.php';
        } elseif (strpos($request_uri, '/api/asignatura') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/asignatura.php';
        } elseif (strpos($request_uri, '/api/evento') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/evento.php';
        } elseif (strpos($request_uri, '/api/imagenevento') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/imagenevento.php';
        } elseif (strpos($request_uri, '/api/taller') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/taller.php';
        } elseif (strpos($request_uri, '/api/bolsa_de_trabajo') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/bolsa_de_trabajo.php';
        } elseif (strpos($request_uri, '/api/login') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/login.php';
        } elseif (strpos($request_uri, '/api/logout') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/logout.php';
        } elseif (strpos($request_uri, '/api/recover_password') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/recover_password.php';
        } elseif (strpos($request_uri, '/api/reset_password') !== false) { // Agregamos esta condición para manejar las solicitudes relacionadas con las direcciones
            include_once 'controllers/reset_password.php';
        } elseif (strpos($request_uri, '/api/talleres') !== false) {
            include_once 'controllers/taller.php';
        } elseif (strpos($request_uri, '/api/calendario') !== false) {
            include_once 'controllers/calendario.php';
        } elseif (strpos($request_uri, '/api/beca') !== false) {
            include_once 'controllers/beca.php';
        } elseif (strpos($request_uri, '/api/status') !== false) {
            // Nueva ruta para verificar el estado de la API
            header('Content-Type: application/json');
            echo json_encode(array("message" => "API is working."));
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
