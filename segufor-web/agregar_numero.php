<?php
// agregar_numero.php
include("db.php");

$mensaje = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger y sanitizar entrada
    $titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';

    if ($titulo === '' || $telefono === '') {
        $mensaje = "<p class='error'>Completa los campos obligatorios (Título y Teléfono).</p>";
    } else {
        // Prepared statement para insertar
        $stmt = $conn->prepare("INSERT INTO numeros_utiles (titulo, telefono, descripcion) VALUES (?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("sss", $titulo, $telefono, $descripcion);
            if ($stmt->execute()) {
                $mensaje = "<p class='ok'>Número útil agregado correctamente.</p>";
                // Limpiar valores para que el formulario quede vacío
                $titulo = $telefono = $descripcion = '';
            } else {
                $mensaje = "<p class='error'>Error al guardar: " . htmlspecialchars($stmt->error) . "</p>";
            }
            $stmt->close();
        } else {
            $mensaje = "<p class='error'>Error en la consulta: " . htmlspecialchars($conn->error) . "</p>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Agregar Número útil - SeguFor</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>

<h2>Agregar Número Útil</h2>

<?php
// Mostrar mensaje si existe
if ($mensaje !== "") {
    echo $mensaje;
}
?>

<form method="POST" action="agregar_numero.php">
    <input type="text" name="titulo" placeholder="Título (ej: Policía)" value="<?php echo isset($titulo) ? htmlspecialchars($titulo) : ''; ?>" required><br>
    <input type="text" name="telefono" placeholder="Teléfono (ej: 911)" value="<?php echo isset($telefono) ? htmlspecialchars($telefono) : ''; ?>" required><br>
    <textarea name="descripcion" placeholder="Descripción (opcional)"><?php echo isset($descripcion) ? htmlspecialchars($descripcion) : ''; ?></textarea><br>
    <button type="submit">Agregar Número</button>
    <a href="index.php" class="btn-volver">Volver</a>

</form>


</body>
</html>
