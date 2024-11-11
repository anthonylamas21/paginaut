 <?php
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require '../vendor/autoload.php';

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Max-Age: 3600");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// $data = json_decode(file_get_contents("php://input"));

// if (!empty($data->email) && !empty($data->reset_token)) {
//     $token = $data->reset_token;
//     $mail = new PHPMailer(true);

//     try {
//         // Configuración del servidor
//         $mail->isSMTP();
//         $mail->Host       = 'smtp.office365.com';
//         $mail->SMTPAuth   = true;
//         $mail->Username   = 'watchwaves111@outlook.com';
//         $mail->Password   = 'WatchWaves';
//         $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
//         $mail->Port       = 587;

//         // Configuración de caracteres UTF-8
//         $mail->CharSet = 'UTF-8';

//         // Destinatarios
//         $mail->setFrom('watchwaves111@outlook.com', 'Universidad Tecnológica de la Costa');
//         $mail->addAddress($data->email);

//         // Contenido del correo
//         $mail->isHTML(true);
//         $mail->Subject = 'Completa tu restablecimiento de contraseña';
//         $mail->Body = '<!DOCTYPE html>
// <html lang="es">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Restablecimiento de Contraseña</title>
// </head>
// <body style="background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
//     <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <!-- Logo -->
//         <div style="text-align: left; margin-bottom: 20px; background-color:#043D3D">
//             <img src="https://www.utdelacosta.edu.mx/img/logo-ut.png" alt="Logo" style="height: 50px;">
//         </div>
//         <!-- Título -->
//         <h1 style="font-size: 24px; color: #333; text-align: left;">Restablece tu contraseña</h1>
//         <!-- Texto de introducción -->
//         <p>Hola,</p>
//         <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, aquí tienes tu código de verificación para restablecer tu contraseña. Si no solicitaste este cambio, por favor ignora este correo.</p>
//         <!-- Contenedor del código -->
//         <div style="background-color: #04847C; color: white; padding: 15px; text-align: center; font-size: 18px; border-radius: 5px; margin: 20px 0;">'
//             . $token .
//         '</div>
//         <!-- Footer -->
//         <p style="text-align: center; font-size: 12px; color: #777;">&copy; 2024 Universidad Tecnológica de la Costa. Todos los derechos reservados.</p>
//     </div>
// </body>
// </html>';

//         $mail->send();
//         echo json_encode(array("message" => "Correo enviado con éxito"));
//     } catch (Exception $e) {
//         http_response_code(500);
//         echo json_encode(array("message" => "Error al enviar el correo.", "error" => $mail->ErrorInfo));
//     }
// } else {
//     http_response_code(400);
//     echo json_encode(array("message" => "Datos incompletos"));
// }


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->reset_token)) {
    $to = $data->email;
    $subject = 'Completa tu restablecimiento de contraseña';
    $token = $data->reset_token;

    // Cuerpo del mensaje HTML
    $message = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
    </head>
    <body style="background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: left; margin-bottom: 20px; background-color:#043D3D">
                <img src="https://www.utdelacosta.edu.mx/img/logo-ut.png" alt="Logo" style="height: 50px;">
            </div>
            <h1 style="font-size: 24px; color: #333; text-align: left;">Restablece tu contraseña</h1>
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, aquí tienes tu código de verificación para restablecer tu contraseña. Si no solicitaste este cambio, por favor ignora este correo.</p>
            <div style="background-color: #04847C; color: white; padding: 15px; text-align: center; font-size: 18px; border-radius: 5px; margin: 20px 0;">'
                . $token .
            '</div>
            <p style="text-align: center; font-size: 12px; color: #777;">&copy; 2024 Universidad Tecnológica de la Costa. Todos los derechos reservados.</p>
        </div>
    </body>
    </html>';

    // Encabezados del correo
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Universidad Tecnológica de la Costa <watchwaves111@outlook.com>" . "\r\n";
    $headers .= "Reply-To: watchwaves111@outlook.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Enviar el correo
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(array("message" => "Correo enviado con éxito"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Error al enviar el correo"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos"));
}
