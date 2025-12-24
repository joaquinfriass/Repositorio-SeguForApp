<?php include("db.php"); ?>

<?php
if ($_POST) {
    $usuario_id = $_POST['usuario_id'];
    $tipo = $_POST['tipo'];
    $descripcion = $_POST['descripcion'];
    $lat = $_POST['latitude'];
    $lng = $_POST['longitude'];

    $sql = "INSERT INTO reportes (usuario_id, tipo, descripcion, latitude, longitude)
            VALUES ($usuario_id, '$tipo', '$descripcion', $lat, $lng)";

    if ($conn->query($sql)) {
        echo "<p class='ok'>Reporte cargado exitosamente</p>";
    } else {
        echo "<p class='error'>Error: " . $conn->error . "</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Alta de reporte</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Alta de Reporte</h2>
<form method="POST">
    <input type="number" name="usuario_id" placeholder="ID Usuario" required><br>
    <input type="text" name="tipo" placeholder="Tipo de reporte" required><br>
    <textarea name="descripcion" placeholder="Descripción" required></textarea><br>
    <input type="text" name="latitude" placeholder="Latitud" required><br>
    <input type="text" name="longitude" placeholder="Longitud" required><br>
    <button type="submit">Guardar</button>
<a href="index.php" class="btn-volver">Volver</a>
</form>

</body>
</html>
