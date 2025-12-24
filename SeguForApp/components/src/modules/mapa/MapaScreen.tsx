import { getReportes } from "@/components/src/api/api";
import { useAuth } from "@/components/src/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { JSX, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

type Reporte = {
  id: number;
  tipo: string;
  descripcion: string;
  latitude: number;
  longitude: number;
  fecha?: string;
  pinColor?: string;
};

export default function MapaScreen(): JSX.Element {
  const { usuario } = useAuth();

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);

  // 🔄 Se ejecuta cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        setLoading(true);

        // 1. Pedir permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isActive) {
            Alert.alert("Permiso denegado", "No se pudo acceder a tu ubicación. Activa el GPS.");
            setLoading(false);
          }
          return;
        }

        // 2. Obtener ubicación actual
        const loc = await Location.getCurrentPositionAsync({});
        if (isActive) {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }

        // 3. Obtener reportes desde la API
        if (usuario && isActive) {
          try {
            const res = await getReportes(usuario.id);

            if (res.status === "ok" && Array.isArray(res.data)) {
              const reportesConColor: Reporte[] = res.data.map((r: any) => {
                const tipo = r.tipo.trim().toLowerCase();
                let pinColor = "blue";
                if (tipo === "riesgo alto") pinColor = "red";
                else if (tipo === "riesgo medio") pinColor = "orange";
                else if (tipo === "riesgo bajo") pinColor = "yellow";

                return {
                  ...r,
                  latitude: Number(r.latitude),
                  longitude: Number(r.longitude),
                  pinColor,
                };
              });

              setReportes(reportesConColor);
            } else {
              setReportes([]);
            }
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los reportes");
          }
        }

        if (isActive) setLoading(false);
      })();

      // Cleanup → evita fugas de memoria
      return () => {
        isActive = false;
      };
    }, [usuario])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!location) {
    Alert.alert("Error", "No se pudo obtener la ubicación actual");
    return <View style={styles.container} />;
  }

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} showsUserLocation followsUserLocation>
        {reportes.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.latitude, longitude: r.longitude }}
            title={r.tipo}
            description={r.descripcion}
            pinColor={r.pinColor || "blue"}
            onPress={() => setReporteSeleccionado(r)}
          />
        ))}
      </MapView>

      {/* Modal informativo */}
      <Modal visible={!!reporteSeleccionado} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {reporteSeleccionado && (
              <>
                <Text style={styles.modalTitle}>{reporteSeleccionado.tipo}</Text>
                <Text style={styles.modalText}>{reporteSeleccionado.descripcion}</Text>
                {reporteSeleccionado.fecha && (
                  <Text style={styles.modalDescription}>
                    Fecha: {reporteSeleccionado.fecha}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => setReporteSeleccionado(null)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  modalText: { fontSize: 16, color: "#555", marginBottom: 5 },
  modalDescription: { fontSize: 15, color: "#666", marginBottom: 20 },
  modalButton: {
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
