<?php include("db.php"); ?>

<!DOCTYPE html>
<html>
<head>
<title>Listado de reportes</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Reportes Ciudadanos</h2>

<table>
<tr>
    <th>ID</th>
    <th>Usuario</th>
    <th>Tipo</th>
    <th>Descripción</th>
    <th>Lat</th>
    <th>Lng</th>
    <th>Fecha</th>
</tr>

<?php
$sql = "SELECT r.*, u.nombre FROM reportes r 
        JOIN usuarios u ON r.usuario_id = u.id";
$result = $conn->query($sql);

while($row = $result->fetch_assoc()):
?>

<tr>
    <td><?= $row['id'] ?></td>
    <td><?= $row['nombre'] ?></td>
    <td><?= $row['tipo'] ?></td>
    <td><?= $row['descripcion'] ?></td>
    <td><?= $row['latitude'] ?></td>
    <td><?= $row['longitude'] ?></td>
    <td><?= $row['fecha'] ?></td>
</tr>

<?php endwhile; ?>

</table>
<a href="index.php" class="btn-volver">Volver</a>
</body>
</html>
