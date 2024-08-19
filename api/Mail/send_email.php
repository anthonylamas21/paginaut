<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->reset_token)) {
    $token = $data->reset_token;
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.office365.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'watchwaves111@outlook.com';
        $mail->Password   = 'WatchWaves';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Configuración de codificación de caracteres a UTF-8
        $mail->CharSet = 'UTF-8';

        //Recipients
        $mail->setFrom('watchwaves111@outlook.com', 'Universidad Tecnológica de la Costa');
        $mail->addAddress($data->email);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Completa tu restablecimiento de contraseña';
        $mail->Body    = 
        '<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento de Contraseña</title>
</head>

<body style="background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Logo -->
        <div style="text-align: left; margin-bottom: 20px; background-color:#043D3D">
            <img src="https://www.utdelacosta.edu.mx/img/logo-ut.png" alt="Logo" style="height: 50px;">
        </div>

        <!-- Título -->
        <h1 style="font-size: 24px; color: #333; text-align: left;">Restablece tu contraseña</h1>

        <!-- Texto de introducción -->
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, aquí tienes tu código de
            verificación para restablecer tu contraseña. Si no solicitaste este cambio, por favor ignora este correo.
        </p>

        <!-- Contenedor del código -->
        <div
            style="background-color: #04847C; color: white; padding: 15px; text-align: center; font-size: 18px; border-radius: 5px; margin: 20px 0;">
            '.$token.'
        </div>

        <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #777;">&copy; 2024 Universidad Tecnológica de la Costa.
            Todos los derechos reservados.</p>
    </div>
</body>
</html>';

        $mail->send();
        // Solo envía una respuesta JSON combinada
        echo json_encode(array("message" => "Correo enviado con éxito"));
        return;
        return;
    } catch (Exception $e) {
        echo json_encode(array("message" => "Error al enviar el correo. Mailer Error: {$mail->ErrorInfo}"));
    }
} else {
    echo json_encode(array("message" => "Datos incompletos"));
}