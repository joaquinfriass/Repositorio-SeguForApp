import { register as registerApi } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import { RootStackParamList } from "@/components/src/navigation/AppNavigator";
import { Usuario } from "@/components/src/types/Usuario";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nombre || !apellido || !email || !password) {
      return Alert.alert("Error", "Completa todos los campos obligatorios");
    }

    setLoading(true);
const res = await registerApi({ nombre, apellido, email, telefono, password });
setLoading(false);

// Validar respuesta correcta
if (res.status !== "ok") {
  return Alert.alert("Error", res.message || "No se pudo registrar el usuario");
}

Alert.alert("Éxito", "Usuario registrado correctamente");

// Mapear los campos según la DB
const usuario: Usuario = {
  id: res.user.id,
  nombre: res.user.nombre,
  apellido: res.user.apellido,
  email: res.user.email,
  telefono: res.user.telefono || "",
  fecha_registro: res.user.fecha_registro,
};

// Guardar usuario en el contexto
login(usuario);

// Redirigir
navigation.replace("Login");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Apellido" style={styles.input} value={apellido} onChangeText={setApellido} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cargando..." : "Registrarse"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLinkText}>¿Ya tenés cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 20, textAlign: "center" },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  loginLink: { marginTop: 20, alignItems: "center" },
  loginLinkText: { color: "#007AFF", fontWeight: "bold", fontSize: 16 },
});
