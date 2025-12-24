<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

// Leer body JSON
$input = json_decode(file_get_contents("php://input"), true);

$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$telefono = $input['telefono'] ?? '';
$password = $input['password'] ?? '';

// Validación mínima
if (!$nombre || !$apellido || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
    exit;
}

// Verificar si el correo ya existe
$check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El correo ya está registrado"]);
    exit;
}

// Cifrar contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, telefono, password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $apellido, $email, $telefono, $hashedPassword);

if ($stmt->execute()) {
    $usuario = [
        "id" => (int)$stmt->insert_id,
        "nombre" => $nombre,
        "apellido" => $apellido,
        "email" => $email,
        "telefono" => $telefono,
        "fecha_registro" => date("Y-m-d H:i:s")
    ];

    echo json_encode(["status" => "ok", "message" => "Usuario registrado correctamente", "user" => $usuario]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al registrar usuario"]);
}
?>
