<?php include("db.php"); ?>

<?php
if ($_POST) {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $telefono = $_POST['telefono'];

    $sql = "INSERT INTO usuarios (nombre, apellido, email, password, telefono)
            VALUES ('$nombre', '$apellido', '$email', '$password', '$telefono')";
    
    if ($conn->query($sql)) {
        echo "<p class='ok'>Usuario registrado correctamente</p>";
    } else {
        echo "<p class='error'>Error: " . $conn->error . "</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Alta de usuario</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Alta de Usuario</h2>



<form method="POST">
    <input type="text" name="nombre" placeholder="Nombre" required><br>
    <input type="text" name="apellido" placeholder="Apellido" required><br>
    <input type="email" name="email" placeholder="Email" required><br>
    <input type="password" name="password" placeholder="Contraseña" required><br>
    <input type="text" name="telefono" placeholder="Teléfono"><br>
    <button type="submit">Guardar</button>
<a href="index.php" class="btn-volver">Volver</a>
</form>

</body>
</html>
