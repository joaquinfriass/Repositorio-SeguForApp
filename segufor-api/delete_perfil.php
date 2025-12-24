<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID de usuario no proporcionado"]);
    exit;
}

$id = intval($data['id']);

// Eliminar usuario
if ($conn->query("DELETE FROM usuarios WHERE id = $id")) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo eliminar el usuario"]);
}
?>
