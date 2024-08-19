<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(dirname(__DIR__) . '/config/database.php');
require_once(dirname(__DIR__) . '/models/BolsaDeTrabajo.php');

$database = new Database();
$db = $database->getConnection();

$bolsaDeTrabajo = new BolsaDeTrabajo($db);

$request_method = $_SERVER["REQUEST_METHOD"];

// Obtener datos de la solicitud
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
  case 'POST':
    if (!empty($data->nombre_empresa) && !empty($data->descripcion_trabajo) && !empty($data->puesto_trabajo) && !empty($data->direccion) && !empty($data->telefono) && !empty($data->correo)) {
      $bolsaDeTrabajo->nombre_empresa = $data->nombre_empresa;
      $bolsaDeTrabajo->descripcion_trabajo = $data->descripcion_trabajo;
      $bolsaDeTrabajo->puesto_trabajo = $data->puesto_trabajo;
      $bolsaDeTrabajo->direccion = $data->direccion;
      $bolsaDeTrabajo->telefono = $data->telefono;
      $bolsaDeTrabajo->correo = $data->correo;
      $bolsaDeTrabajo->activo = isset($data->activo) ? filter_var($data->activo, FILTER_VALIDATE_BOOLEAN) : true;

      try {
        // Iniciar transacción
        $db->beginTransaction();

        // Crear la bolsa de trabajo
        if ($bolsaDeTrabajo->create()) {
          // Recuperar el ID generado
          $bolsaDeTrabajoId = $bolsaDeTrabajo->id;

          if ($bolsaDeTrabajoId > 0) {
            // Guardar requisitos si los hay
            if (isset($data->requisitos) && is_array($data->requisitos)) {
              $bolsaDeTrabajo->id = $bolsaDeTrabajoId;
              if (!$bolsaDeTrabajo->saveRequisitos($data->requisitos)) {
                throw new Exception("Error al guardar requisitos");
              }
            }

            // Confirmar la transacción
            $db->commit();

            http_response_code(201);
            echo json_encode(array("message" => "Bolsa de trabajo creada correctamente."));
          } else {
            throw new Exception("ID de bolsa de trabajo no encontrado después de la inserción");
          }
        } else {
          throw new Exception("Error al crear bolsa de trabajo");
        }
      } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $db->rollBack();
        http_response_code(503);
        echo json_encode(array("message" => "Bolsa creada, pero no se pudieron guardar los requisitos. Error: " . $e->getMessage()));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Datos incompletos."));
    }
    break;

  case 'GET':
    if (isset($_GET['id'])) {
      $bolsaDeTrabajo->id = $_GET['id'];
      if ($bolsaDeTrabajo->readOne()) {
        echo json_encode($bolsaDeTrabajo->getDetalles());
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
      }
    } else {
      echo json_encode(array("records" => $bolsaDeTrabajo->read()));
    }
    break;

  case 'PUT':
    if (isset($_GET['id'])) {
      $bolsaDeTrabajo->id = $_GET['id'];
      if ($bolsaDeTrabajo->readOne()) {
        $bolsaDeTrabajo->nombre_empresa = !empty($data->nombre_empresa) ? $data->nombre_empresa : $bolsaDeTrabajo->nombre_empresa;
        $bolsaDeTrabajo->descripcion_trabajo = !empty($data->descripcion_trabajo) ? $data->descripcion_trabajo : $bolsaDeTrabajo->descripcion_trabajo;
        $bolsaDeTrabajo->puesto_trabajo = !empty($data->puesto_trabajo) ? $data->puesto_trabajo : $bolsaDeTrabajo->puesto_trabajo;
        $bolsaDeTrabajo->direccion = !empty($data->direccion) ? $data->direccion : $bolsaDeTrabajo->direccion;
        $bolsaDeTrabajo->telefono = !empty($data->telefono) ? $data->telefono : $bolsaDeTrabajo->telefono;
        $bolsaDeTrabajo->correo = !empty($data->correo) ? $data->correo : $bolsaDeTrabajo->correo;
        $bolsaDeTrabajo->activo = isset($data->activo) ? filter_var($data->activo, FILTER_VALIDATE_BOOLEAN) : $bolsaDeTrabajo->activo;

        if ($bolsaDeTrabajo->update()) {
          if (isset($data->requisitos) && is_array($data->requisitos)) {
            $bolsaDeTrabajo->updateRequisitos($data->requisitos);
          }

          http_response_code(200);
          echo json_encode(array("message" => "Bolsa de trabajo actualizada correctamente."));
        } else {
          http_response_code(503);
          echo json_encode(array("message" => "No se pudo actualizar la bolsa de trabajo."));
        }
      } else {
        http_response_code(404);
        echo json_encode(array("message" => "Bolsa de trabajo no encontrada."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;

  case 'DELETE':
    if (isset($_GET['id'])) {
      $bolsaDeTrabajo->id = $_GET['id'];
      if ($bolsaDeTrabajo->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Bolsa de trabajo eliminada correctamente."));
      } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo eliminar la bolsa de trabajo."));
      }
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "No se proporcionó un ID."));
    }
    break;
}
