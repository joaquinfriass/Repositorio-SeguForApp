<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

// Leer body JSON
$input = json_decode(file_get_contents("php://input"), true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, nombre, apellido, password, email, telefono, fecha_registro FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    exit;
}

$user = $result->fetch_assoc();

// 🔹 Verificar hash de la contraseña
if (password_verify($password, $user['password'])) {
    // No devolver la contraseña al cliente
    unset($user['password']);

    echo json_encode([
        "status" => "ok",
        "user" => $user
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
}
?>
