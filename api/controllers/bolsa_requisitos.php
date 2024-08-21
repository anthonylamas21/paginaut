<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(dirname(__DIR__) . '/config/database.php');
require_once(dirname(__DIR__) . '/models/BolsaRequisitos.php');

$database = new Database();
$db = $database->getConnection();

$BolsaRequisitos = new BolsaRequisitos($db);

$request_method = $_SERVER["REQUEST_METHOD"];

// Obtener datos de la solicitud
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
  case 'POST':
    if (!empty($data->requisitos) && is_array($data->requisitos)) {   
      
      foreach ($data->requisitos as $requisito) {
        if (!empty($requisito->requisito) && !empty($requisito->id_bolsadetrabajo)) {
            $messages = [];
            $BolsaRequisitos->id_bolsadetrabajo = $requisito->id_bolsadetrabajo;
            $BolsaRequisitos->requisito = $requisito->requisito;
            
            if ($BolsaRequisitos->create()) {
                $messages[] = "Requisito creado correctamente.";
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "No se pudo crear el requisito."));
                exit(); // Detener la ejecución si hay un error
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "No se reciben los datos en uno de los requisitos"));
            exit(); // Detener la ejecución si falta algún dato
        }
    }
    http_response_code(200);
    echo json_encode(array("message" => implode(" ", $messages)));
      } else {
        http_response_code(400);
        echo json_encode(array("message" => "No se reciben los datos o no es un array"));
      }
    break;

  case 'GET':
    if (isset($_GET['id']) && !empty($_GET['id'])) {
      $BolsaRequisitos->id_bolsadetrabajo = $_GET['id'];
      
      if ($BolsaRequisitos->getDetalles()) {
          http_response_code(200);
          echo json_encode(array("details" => $BolsaRequisitos->detalles));
      } else {
          http_response_code(404);
          echo json_encode(array("message" => "No se encontraron registros para la bolsa de trabajo con ese ID."));
      }
  } else {
      http_response_code(400); // Código de error para solicitud incorrecta
      echo json_encode(array("message" => "Datos incompletos o inválidos."));
  }
    break;
    case 'PUT':
      if (isset($data->requisitos) && is_array($data->requisitos)) {
          try {
              // Iniciar transacción
              $db->beginTransaction();
  
              // Primero, elimina todos los requisitos existentes para esta bolsa de trabajo
              $BolsaRequisitos->id_bolsadetrabajo = $data->requisitos[0]->id_bolsadetrabajo;
              $BolsaRequisitos->deleteByBolsaTrabajoId();
  
              // Luego, inserta los nuevos o actualizados
              foreach ($data->requisitos as $requisito) {
                  if (!empty($requisito->requisito) && !empty($requisito->id_bolsadetrabajo)) {
                      $BolsaRequisitos->id_bolsadetrabajo = $requisito->id_bolsadetrabajo;
                      $BolsaRequisitos->requisito = $requisito->requisito;
  
                      // Crear un nuevo requisito
                      if (!$BolsaRequisitos->create()) {
                          throw new Exception("Error al crear requisito");
                      }
                  } else {
                      throw new Exception("Datos incompletos en el requisito");
                  }
              }
  
              // Confirmar la transacción
              $db->commit();
  
              http_response_code(200);
              echo json_encode(array("message" => "Requisitos procesados correctamente."));
          } catch (Exception $e) {
              // Revertir la transacción en caso de error
              $db->rollBack();
              http_response_code(500);
              echo json_encode(array("message" => "Error: " . $e->getMessage()));
          }
      } else {
          http_response_code(400);
          echo json_encode(array("message" => "Datos incompletos o inválidos."));
      }
      break;  

  case 'DELETE':
    if (isset($_GET['id'])) {
      $BolsaRequisitos->id = $_GET['id'];
      
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;
}
