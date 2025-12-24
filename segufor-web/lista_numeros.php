<?php include("db.php"); ?>

<!DOCTYPE html>
<html>
<head>
<title>Números útiles</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Números Útiles</h2>

<table>
<tr>
    <th>ID</th>
    <th>Título</th>
    <th>Teléfono</th>
    <th>Descripción</th>
    <th>Acciones</th>
</tr>

<?php
$result = $conn->query("SELECT * FROM numeros_utiles");

while($row = $result->fetch_assoc()):
?>
<tr>
    <td><?= $row['id'] ?></td>
    <td><?= $row['titulo'] ?></td>
    <td><?= $row['telefono'] ?></td>
    <td><?= $row['descripcion'] ?></td>

    <td>
        <a href="editar_numero.php?id=<?= $row['id'] ?>" class="btn-editar">Editar</a>
        <a href="eliminar_numero.php?id=<?= $row['id'] ?>" 
           class="btn-eliminar"
           onclick="return confirm('¿Seguro que deseas eliminar este número útil?');">
           Eliminar
        </a>
    </td>
</tr>

<?php endwhile; ?>

</table>

<a href="index.php" class="btn-volver">Volver</a>

</body>
</html>
