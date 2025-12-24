import { createReporte } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Alert, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EmergenciaScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { usuario } = useAuth();

  const handleSOSPress = () => {
    setModalVisible(true);
  };

  const handleCall911 = () => {
    Linking.openURL("tel:911");
    setModalVisible(false);
  };

  const handleEnviarUbicacion = async () => {
    if (!usuario) {
      Alert.alert("Error", "Debe iniciar sesión para enviar ubicación");
      return;
    }

    setModalVisible(false);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a la ubicación");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    try {
      const res = await createReporte({
        usuario_id: usuario.id,
        tipo: "Riesgo Alto",
        descripcion: "Llamado SOS, ubicación registrada",
        latitude,
        longitude,
      });

      if (res.status === "ok") {
        Alert.alert("Éxito", "Ubicación registrada correctamente");
      } else {
        Alert.alert("Error", res.message || "No se pudo registrar la ubicación");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error al conectar con la API");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Botón de Emergencia</Text>
      <Text style={styles.subtitle}>Presioná el botón para solicitar ayuda</Text>

      <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Ionicons name="alert" size={80} color="white" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Qué querés hacer?</Text>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#d9534f" }]}
              onPress={handleCall911}
            >
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.actionText}>Llamar al 911</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#007AFF" }]}
              onPress={handleEnviarUbicacion}
            >
              <Ionicons name="location" size={24} color="white" />
              <Text style={styles.actionText}>Enviar mi ubicación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#aaa" }]}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.actionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 40,
  },
  sosButton: {
    backgroundColor: "#d9534f",
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#d9534f",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  sosText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
