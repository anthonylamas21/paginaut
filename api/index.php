<?php
// Configurar la zona horaria a America/Mazatlan
date_default_timezone_set('America/Mazatlan');

// Permitir origen desde cualquier origen (CORS)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Manejar solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

// Función para validar el token
function validarToken($token) {
    // Aquí debes implementar la lógica de validación del token.
    // Por ejemplo, podrías comprobar si el token existe en una base de datos o es válido de alguna manera.
    // Para efectos de este ejemplo, vamos a considerar el token "token_secreto" como válido.
    return $token === "token_secreto";
}

// Verificar si se requiere un token para ciertos métodos
$request_method = $_SERVER["REQUEST_METHOD"];
$token = isset($_SERVER['HTTP_AUTHORIZATION']) ? trim(str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION'])) : null;
$current_route = $_SERVER['REQUEST_URI'];

// Definir el directorio base
$baseDir = dirname(__FILE__);

// Función para incluir el controlador correspondiente
function loadController($route, $controllerFile) {
    global $baseDir;
    if (strpos($_SERVER['REQUEST_URI'], $route) !== false) {
        include_once $baseDir . '/controllers/' . $controllerFile;
        return true;
    }
    return false;
}

// Definir las rutas disponibles
$routes = [
    '/api/usuario' => 'usuario.php',
    '/api/rol' => 'rol.php',
    '/api/departamento' => 'departamento.php',
    '/api/direccion' => 'direccion.php',
    '/api/carrera' => 'carrera.php',
    '/api/cuatrimestre' => 'cuatrimestre.php',
    '/api/asignatura' => 'asignatura.php',
    '/api/evento' => 'evento.php',
    '/api/imagenevento' => 'imagenevento.php',
    '/api/taller' => 'taller.php',
    '/api/bolsa_de_trabajo' => 'bolsa_de_trabajo.php',
    '/api/login' => 'login.php',
    '/api/logout' => 'logout.php',
    '/api/recover_password' => 'recover_password.php',
    '/api/reset_password' => 'reset_password.php',
    '/api/deleteToken' => 'deleteToken.php',
    '/api/talleres' => 'taller.php',
    '/api/calendario' => 'calendario.php',
    '/api/beca' => 'beca.php',
    '/api/noticia' => 'noticia.php',
    '/api/instalacion' => 'instalacion.php',
    '/api/status' => '',
    '/api/niveles-estudios' => 'NivelesEstudiosController.php',
    '/api/campo-estudio' => 'CampoEstudioController.php',
    '/api/asignaturas' => 'asignatura.php',
    '/api/send_reset_email' => 'send_reset_email.php',
    '/api/bolsa_requisitos' => 'bolsa_requisitos.php',
    '/api/profesor' => 'ProfesorController.php',
    '/api/tipo-pro' => 'ProfesorTipoController.php',
    '/api/curso_maestro' => 'curso_maestro.php',
    '/api/curso' => 'curso.php',
    '/api/historial' => 'historial.php',
    '/api/visita' => 'visitas.php',
    '/api/convocatoria' => 'convocatoria.php',
];

$found = false;
foreach ($routes as $route => $controller) {
    if ($route == '/api/status' && strpos($_SERVER['REQUEST_URI'], '/api/status') !== false) {
        header('Content-Type: application/json');
        echo json_encode(["message" => "API is working."]);
        $found = true;
        break;
    }

    if (loadController($route, $controller)) {
        $found = true;
        break;
    }
}

// Ruta adicional para /api/cuatrimestres/carrera/{carrera_id}/asignaturas
if (!$found && strpos($_SERVER['REQUEST_URI'], '/api/cuatrimestres/carrera/') !== false && $request_method == 'GET') {
    include_once $baseDir . '/controllers/cuatrimestre.php';
    $found = true;
}

if (!$found) {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["message" => "Endpoint not found."]);
}
?>
