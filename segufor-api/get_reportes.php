<?php
header("Content-Type: application/json; charset=UTF-8");
include "conexion.php";

$result = $conn->query("
    SELECT r.id, r.tipo, r.descripcion, r.latitude, r.longitude, r.fecha, u.nombre 
    FROM reportes r
    JOIN usuarios u ON r.usuario_id = u.id
    ORDER BY r.fecha DESC
");

$reportes = [];
while ($row = $result->fetch_assoc()) {
    $reportes[] = $row;
}

echo json_encode([
    "status" => "ok",
    "data" => $reportes
]);
?>
