<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$result = $conn->query("SELECT * FROM numeros_utiles ORDER BY id ASC");

$numeros = [];
while ($row = $result->fetch_assoc()) {
    $numeros[] = $row;
}

echo json_encode([
    "status" => "ok",
    "data" => $numeros
]);
?>
