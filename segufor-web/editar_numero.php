<?php
include("db.php");

if (!isset($_GET['id'])) {
    die("ID no proporcionado.");
}

$id = $_GET['id'];

// Si el usuario envió cambios
if ($_POST) {
    $titulo = $_POST['titulo'];
    $telefono = $_POST['telefono'];
    $descripcion = $_POST['descripcion'];

    $sql = "UPDATE numeros_utiles 
            SET titulo='$titulo',
                telefono='$telefono',
                descripcion='$descripcion'
            WHERE id=$id";

    if ($conn->query($sql)) {
        echo "<p class='ok'>Número útil actualizado correctamente.</p>";
    } else {
        echo "<p class='error'>Error: " . $conn->error . "</p>";
    }
}

// Obtener datos actuales
$result = $conn->query("SELECT * FROM numeros_utiles WHERE id=$id");
$numero = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
<title>Editar número útil</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Editar Número Útil</h2>

<form method="POST">
    <input type="text" name="titulo" value="<?= $numero['titulo'] ?>" required><br>
    <input type="text" name="telefono" value="<?= $numero['telefono'] ?>" required><br>
    <textarea name="descripcion" rows="3"><?= $numero['descripcion'] ?></textarea><br>

    <button type="submit">Guardar Cambios</button>
    <a href="lista_numeros.php" class="btn-volver">Volver</a>
</form>



</body>
</html>
