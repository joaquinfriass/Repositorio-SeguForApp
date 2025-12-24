<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$id = $_GET['id'] ?? '';

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Falta ID de usuario"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, nombre, apellido, email, telefono FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode(["status" => "ok", "data" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
}
?>
