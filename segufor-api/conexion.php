<?php
// C:\xampp\htdocs\segufor-api\conexion.php
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = "";
$db = "seguforapp"; // <- usar el nombre de la base de datos que creaste

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión con la base de datos: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");
?>
