import { login as loginApi } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import { RootStackParamList } from "@/components/src/navigation/AppNavigator";
import { Usuario } from "@/components/src/types/Usuario";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return Alert.alert("Error", "Completa todos los campos");

    setLoading(true);
    const res = await loginApi(email, password);
    setLoading(false);

    if (res.status !== "ok") return Alert.alert("Error", res.message || "Credenciales incorrectas");

    // Mapear los campos según la DB
    const usuario: Usuario = {
      id: res.user.id,
      nombre: res.user.nombre,
      apellido: res.user.apellido,
      email: res.user.email,
      telefono: res.user.telefono || "",
      fecha_registro: res.user.fecha_registro,
    };

    login(usuario);

    navigation.replace("HomeTabs");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cargando..." : "Ingresar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
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
  buttonSecondary: {
    backgroundColor: "#555", // color diferente si querés distinguir
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
