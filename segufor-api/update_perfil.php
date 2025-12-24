<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

// Leer JSON del body
$input = json_decode(file_get_contents("php://input"), true);

$id = $input['id'] ?? '';
$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$telefono = $input['telefono'] ?? '';

if (!$id || !$nombre || !$apellido) {
    echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
    exit;
}

// Actualizar usuario
$stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?");
$stmt->bind_param("sssi", $nombre, $apellido, $telefono, $id);

if ($stmt->execute()) {
    // Traer datos actualizados
    $query = $conn->prepare("SELECT id, nombre, apellido, email, telefono, fecha_registro FROM usuarios WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();
    $user = $result->fetch_assoc();

    echo json_encode([
        "status" => "ok",
        "message" => "Perfil actualizado correctamente",
        "user" => $user
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar perfil"]);
}
?>
