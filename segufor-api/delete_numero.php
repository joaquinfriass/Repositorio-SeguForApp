<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
    exit;
}

$id = intval($data['id']);

$stmt = $conn->prepare("DELETE FROM numeros_utiles WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "message" => "Número eliminado"]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo eliminar el número"]);
}

$stmt->close();
$conn->close();
?>
