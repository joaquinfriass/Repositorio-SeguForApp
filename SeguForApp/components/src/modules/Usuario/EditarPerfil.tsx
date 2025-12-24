import { deleteUser, updateUser } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PerfilStackParamList } from "@/components/src/navigation/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<PerfilStackParamList, "EditarPerfil">;

export default function EditarPerfilScreen({ navigation }: Props) {
  const { usuario, setUsuario } = useAuth();

  if (!usuario) return <Text style={styles.loadingText}>Cargando...</Text>;

  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);
  const [email, setEmail] = useState(usuario.email);
  const [telefono, setTelefono] = useState(usuario.telefono);

  const guardarCambios = async () => {
    if (!nombre || !apellido) {
      Alert.alert("Error", "Nombre y Apellido son obligatorios");
      return;
    }

    try {
      const res = await updateUser({
        id: usuario.id,
        nombre,
        apellido,
        email,
        telefono,
      });

      if (res.status === "ok") {
        setUsuario({
          id: usuario.id,
          nombre,
          apellido,
          email,
          telefono: telefono || "",
          fecha_registro: usuario.fecha_registro,
        });

        Alert.alert("Éxito", "Perfil actualizado correctamente");
        navigation.goBack();
      } else {
        Alert.alert("Error", res.message || "No se pudo actualizar el perfil");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al actualizar el perfil");
      console.log(error);
    }
  };

  const confirmarEliminar = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: eliminarPerfil },
      ]
    );
  };

  const eliminarPerfil = async () => {
    if (!usuario) return;

    try {
      const res = await deleteUser(usuario.id);
      if (res.status === "ok") {
        setUsuario(null);
        // Navegar al stack principal (Login)
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        Alert.alert("Perfil eliminado", "Tu perfil ha sido eliminado correctamente");
      } else {
        Alert.alert("Error", res.message || "No se pudo eliminar el perfil");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un problema al eliminar el perfil");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Apellido</Text>
      <TextInput style={styles.input} value={apellido} onChangeText={setApellido} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} />

      <TouchableOpacity style={styles.button} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#E53935", marginTop: 10 }]}
        onPress={confirmarEliminar}
      >
        <Text style={styles.buttonText}>Eliminar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#999", marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center" },
  label: { fontSize: 14, marginBottom: 5, color: "#555" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  loadingText: { textAlign: "center", marginTop: 20, fontSize: 18 },
});
