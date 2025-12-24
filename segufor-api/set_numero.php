<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['titulo'], $data['telefono'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios"
    ]);
    exit;
}

$titulo = $data['titulo'];
$telefono = $data['telefono'];
$descripcion = $data['descripcion'] ?? "";

$stmt = $conn->prepare("INSERT INTO numeros_utiles (titulo, telefono, descripcion) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $titulo, $telefono, $descripcion);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "ok",
        "message" => "Número agregado correctamente",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo agregar el número"
    ]);
}

$stmt->close();
$conn->close();
?>
