<?php
session_start();

if (isset($_SESSION["usuario"])) {
    unset($_SESSION["usuario"]);
    session_destroy();
    http_response_code(200);
    echo json_encode(array("message" => "Sesión cerrada correctamente"));
} else {
    http_response_code(400);
    echo json_encode(array("message" => "No hay una sesión activa"));
}