import { useAuth } from "@/components/src/context/AuthContext";
import { PerfilStackParamList, RootStackParamList } from "@/components/src/navigation/AppNavigator";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  const { usuario, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PerfilStackParamList>>();

  const [datos, setDatos] = useState(usuario);

  useFocusEffect(
    useCallback(() => {
      setDatos(usuario);
    }, [usuario])
  );

  if (!datos) return <Text style={styles.loadingText}>Cargando...</Text>;

  const handleLogout = () => {
    logout();
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{datos.nombre}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{datos.apellido}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{datos.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{datos.telefono}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2587b4ff" }]}
        onPress={() => navigation.navigate("EditarPerfil")}
      >
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#666" }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center" },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 14, color: "#888" },
  value: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 3 },
  button: {
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
