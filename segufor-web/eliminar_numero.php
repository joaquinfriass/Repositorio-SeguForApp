<?php
include("db.php");

if (!isset($_GET['id'])) {
    die("ID no proporcionado.");
}

$id = $_GET['id'];

$sql = "DELETE FROM numeros_utiles WHERE id=$id";

if ($conn->query($sql)) {
    echo "<p class='ok'>Número útil eliminado correctamente.</p>";
} else {
    echo "<p class='error'>Error: " . $conn->error . "</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Eliminar número</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<button onclick="history.back()" class="btn-volver">← Volver atrás</button>

</body>
</html>
