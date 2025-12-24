<?php
// C:\xampp\htdocs\segufor-api\add_Reporte.php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

// Leer JSON enviado desde el front
$input = json_decode(file_get_contents("php://input"), true);

$usuario_id = $input['usuario_id'] ?? '';
$tipo = $input['tipo'] ?? '';
$descripcion = $input['descripcion'] ?? '';
$latitude = $input['latitude'] ?? '';
$longitude = $input['longitude'] ?? '';

// Validación mínima
if (!$usuario_id || !$tipo || !$latitude || !$longitude) {
    echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
    exit;
}

// Preparar insert
$stmt = $conn->prepare("
    INSERT INTO reportes (usuario_id, tipo, descripcion, latitude, longitude)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("issdd", $usuario_id, $tipo, $descripcion, $latitude, $longitude);

// Ejecutar y devolver resultado
if ($stmt->execute()) {
    echo json_encode([
        "status" => "ok",
        "message" => "Reporte agregado correctamente",
        "reporte_id" => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al guardar el reporte"]);
}
?>

