import { createReporte, getReportes } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Reporte = {
  id: number;
  tipo: string;
  descripcion: string;
  latitude: number;
  longitude: number;
  fecha: string;
};

export default function ReportesScreen() {
  const { usuario } = useAuth();

  const [nivel, setNivel] = useState<"Riesgo Bajo" | "Riesgo Medio" | "Riesgo Alto">("Riesgo Bajo");
  const [descripcion, setDescripcion] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loadingReportes, setLoadingReportes] = useState(true);

  // Solicitar ubicación al montar la pantalla
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se requiere acceso a la ubicación para enviar reportes");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // Cargar reportes cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      if (usuario) cargarReportes();
    }, [usuario])
  );

  const cargarReportes = async () => {
    if (!usuario) return;
    setLoadingReportes(true);
    try {
      const res = await getReportes(usuario.id);
      if (res.status === "ok") {
        setReportes(res.data);
      } else {
        console.log("Error al traer reportes:", res);
      }
    } catch (error) {
      console.log("Error al cargar reportes:", error);
    } finally {
      setLoadingReportes(false);
    }
  };

  const enviarReporte = async () => {
    if (!usuario) {
      Alert.alert("Error", "Debe iniciar sesión para enviar un reporte");
      return;
    }
    if (!nivel) {
      Alert.alert("Error", "Debe seleccionar un nivel de riesgo");
      return;
    }
    if (!location) {
      Alert.alert("Error", "No se pudo obtener la ubicación");
      return;
    }

    try {
      const res = await createReporte({
        usuario_id: usuario.id,
        tipo: nivel,
        descripcion,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (res.status === "ok") {
        Alert.alert("Éxito", "Reporte enviado correctamente");
        setNivel("Riesgo Bajo");
        setDescripcion("");
        cargarReportes(); // refrescar lista
      } else {
        Alert.alert("Error", res.message || "No se pudo enviar el reporte");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error al conectar con la API");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nivel de riesgo</Text>
      <Picker
        selectedValue={nivel}
        onValueChange={(value) => setNivel(value as "Riesgo Bajo" | "Riesgo Medio" | "Riesgo Alto")}
        style={styles.picker}
      >
        <Picker.Item label="Riesgo Bajo" value="Riesgo Bajo" />
        <Picker.Item label="Riesgo Medio" value="Riesgo Medio" />
        <Picker.Item label="Riesgo Alto" value="Riesgo Alto" />
      </Picker>

      <Text style={styles.label}>Descripción del hecho</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Enviar Reporte" onPress={enviarReporte} />

      <Text style={[styles.label, { marginTop: 20 }]}>Mis Reportes</Text>
      {loadingReportes ? (
        <Text>Cargando reportes...</Text>
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reporteItem}>
              <Text style={styles.reporteTitulo}>{item.tipo}</Text>
              <Text>{item.descripcion}</Text>
              <Text style={styles.reporteFecha}>{item.fecha}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  reporteItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  reporteTitulo: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  reporteFecha: { fontSize: 12, color: "#666", marginTop: 5 },
});
