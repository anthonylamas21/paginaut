<?php
include_once 'C:/xampp/htdocs/paginaut/api/config/database.php';
include_once 'C:/xampp/htdocs/paginaut/api/models/BolsaDeTrabajo.php';
include_once 'C:/xampp/htdocs/paginaut/api/models/HorariosBolsa.php';
include_once 'C:/xampp/htdocs/paginaut/api/models/RequisitosBolsa.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
  $bolsaDeTrabajo = new BolsaDeTrabajo($db);

  $bolsaDeTrabajo->nombre_empresa = $_POST['nombre_empresa'];
  $bolsaDeTrabajo->descripcion = $_POST['descripcion'];
  $bolsaDeTrabajo->direccion = $_POST['direccion'];
  $bolsaDeTrabajo->telefono = $_POST['telefono'];
  $bolsaDeTrabajo->correo = $_POST['correo'];
  $bolsaDeTrabajo->puesto = $_POST['puesto'];
  $bolsaDeTrabajo->activo = true;

  if (isset($_FILES['archivo'])) {
    $bolsaDeTrabajo->archivo = $_FILES['archivo']['name'];
  } else {
    $bolsaDeTrabajo->archivo = null;
  }

  $horarios = json_decode($_POST['horarios'], true);
  $requisitos = json_decode($_POST['requisitos'], true);

  if ($bolsaDeTrabajo->create()) {
    $bolsaId = $db->lastInsertId();  // Obtener el ID de la bolsa de trabajo recién creada

    foreach ($horarios as $horario) {
      $horariosBolsa = new HorariosBolsa($db);
      $horariosBolsa->bolsa_id = $bolsaId;
      $horariosBolsa->dia = $horario['dia'];
      $horariosBolsa->hora_inicio = $horario['hora_inicio'];
      $horariosBolsa->hora_fin = $horario['hora_fin'];
      $horariosBolsa->cerrado = $horario['cerrado'];
      $horariosBolsa->create();
    }

    foreach ($requisitos as $requisito) {
      $requisitosBolsa = new RequisitosBolsa($db);
      $requisitosBolsa->bolsa_id = $bolsaId;
      $requisitosBolsa->descripcion = $requisito['descripcion'];
      $requisitosBolsa->create();
    }

    echo json_encode(["message" => "Bolsa de trabajo agregada correctamente"]);
  } else {
    echo json_encode(["message" => "Error al agregar la bolsa de trabajo"]);
  }
} elseif ($method === 'GET') {
  $bolsaDeTrabajo = new BolsaDeTrabajo($db);

  if (isset($_GET['id'])) {
    $bolsaDeTrabajo->id = $_GET['id'];
    $bolsaDeTrabajo->readOne();

    echo json_encode([
      "id" => $bolsaDeTrabajo->id,
      "nombre_empresa" => $bolsaDeTrabajo->nombre_empresa,
      "descripcion" => $bolsaDeTrabajo->descripcion,
      "direccion" => $bolsaDeTrabajo->direccion,
      "telefono" => $bolsaDeTrabajo->telefono,
      "correo" => $bolsaDeTrabajo->correo,
      "puesto" => $bolsaDeTrabajo->puesto,
      "archivo" => $bolsaDeTrabajo->archivo,
      "activo" => $bolsaDeTrabajo->activo,
      "fecha_creacion" => $bolsaDeTrabajo->fecha_creacion,
    ]);
  } else {
    $stmt = $bolsaDeTrabajo->read();
    $bolsas = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      extract($row);
      $bolsas[] = [
        "id" => $id,
        "nombre_empresa" => $nombre_empresa,
        "descripcion" => $descripcion,
        "direccion" => $direccion,
        "telefono" => $telefono,
        "correo" => $correo,
        "puesto" => $puesto,
        "archivo" => $archivo,
        "activo" => $activo,
        "fecha_creacion" => $fecha_creacion,
      ];
    }

    echo json_encode(["records" => $bolsas]);
  }
} elseif ($method === 'PUT') {
  parse_str(file_get_contents("php://input"), $_PUT);

  $bolsaDeTrabajo = new BolsaDeTrabajo($db);

  $bolsaDeTrabajo->id = $_PUT['id'];
  $bolsaDeTrabajo->activo = $_PUT['activo'];

  if ($bolsaDeTrabajo->updateStatus()) {
    echo json_encode(["message" => "Bolsa de trabajo actualizada correctamente"]);
  } else {
    echo json_encode(["message" => "Error al actualizar la bolsa de trabajo"]);
  }
} elseif ($method === 'DELETE') {
  parse_str(file_get_contents("php://input"), $_DELETE);

  $bolsaDeTrabajo = new BolsaDeTrabajo($db);
  $bolsaDeTrabajo->id = $_DELETE['id'];

  if ($bolsaDeTrabajo->delete()) {
    echo json_encode(["message" => "Bolsa de trabajo eliminada correctamente"]);
  } else {
    echo json_encode(["message" => "Error al eliminar la bolsa de trabajo"]);
  }
}
