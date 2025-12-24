<?php include("db.php"); ?>

<!DOCTYPE html>
<html>
<head>
<title>Listado de usuarios</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Usuarios Registrados</h2>

<table>
<tr>
    <th>ID</th>
    <th>Nombre</th>
    <th>Apellido</th>
    <th>Email</th>
    <th>Teléfono</th>
    <th>Acciones</th>
</tr>

<?php
$result = $conn->query("SELECT * FROM usuarios");
while ($row = $result->fetch_assoc()):
?>

<tr>
    <td><?= $row['id'] ?></td>
    <td><?= $row['nombre'] ?></td>
    <td><?= $row['apellido'] ?></td>
    <td><?= $row['email'] ?></td>
    <td><?= $row['telefono'] ?></td>

    <td>
        <a href="editar_usuario.php?id=<?= $row['id'] ?>" class="btn-editar">Editar</a>
        <a href="eliminar_usuario.php?id=<?= $row['id'] ?>" 
           onclick="return confirm('¿Seguro que deseas eliminar este usuario?')" 
           class="btn-eliminar">Eliminar</a>
    </td>
</tr>

<?php endwhile; ?>

</table>

<a href="index.php" class="btn-volver">Volver</a>

</body>
</html>
