<?php
include("db.php");

$id = $_GET['id'];

$sql = "DELETE FROM usuarios WHERE id = $id";

if ($conn->query($sql)) {
    header("Location: listado_usuarios.php");
    exit();
} else {
    echo "Error al eliminar: " . $conn->error;
}
