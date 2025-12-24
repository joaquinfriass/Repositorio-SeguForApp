<?php
include("db.php");

// ===========================
// 1) OBTENER DATOS DEL USUARIO
// ===========================
if (!isset($_GET['id'])) {
    echo "ID de usuario no especificado.";
    exit();
}

$id = $_GET['id'];

$result = $conn->query("SELECT * FROM usuarios WHERE id = $id");

if ($result->num_rows == 0) {
    echo "Usuario no encontrado.";
    exit();
}

$usuario = $result->fetch_assoc();


// ===========================
// 2) ACTUALIZAR USUARIO
// ===========================
if ($_POST) {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];

    // NO actualizamos contraseña aquí para evitar modificaciones accidentales

    $sql = "UPDATE usuarios 
            SET nombre='$nombre', apellido='$apellido', email='$email', telefono='$telefono'
            WHERE id=$id";

    if ($conn->query($sql)) {
        $mensaje = "<p class='ok'>Usuario actualizado correctamente ✔</p>";
    } else {
        $mensaje = "<p class='error'>Error: " . $conn->error . "</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Editar Usuario</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Editar Usuario</h2>

<?= $mensaje ?? '' ?>

<form method="POST">

    <input type="text" name="nombre" value="<?= $usuario['nombre'] ?>" required><br>
    <input type="text" name="apellido" value="<?= $usuario['apellido'] ?>" required><br>
    <input type="email" name="email" value="<?= $usuario['email'] ?>" required><br>
    <input type="text" name="telefono" value="<?= $usuario['telefono'] ?>"><br>

    <button type="submit">Actualizar</button>
    <a href="lista_usuarios.php" class="btn-volver">Volver</a>
</form>



</body>
</html>
