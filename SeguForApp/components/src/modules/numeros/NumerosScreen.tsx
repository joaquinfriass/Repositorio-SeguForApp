import { deleteNumero, getNumeros, setNumero } from "@/components/src/api/api";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type NumeroUtil = {
  id: number;
  titulo: string;
  numero: string;
  descripcion?: string;
};

export default function NumerosScreen() {
  const [numeros, setNumeros] = useState<NumeroUtil[]>([]);
  const [contactos, setContactos] = useState<NumeroUtil[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroAEliminar, setNumeroAEliminar] = useState<NumeroUtil | null>(null);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoNumero, setNuevoNumero] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarNumeros();
    }, [])
  );

  const cargarNumeros = async () => {
    setLoading(true);
    try {
      const res = await getNumeros();
      if (res.status === "ok") {
        const todos: NumeroUtil[] = res.data.map((n: any) => ({
          id: n.id,
          titulo: n.titulo,
          numero: n.telefono,
          descripcion: n.descripcion,
        }));

        setNumeros(todos.filter((n) => n.descripcion !== "contacto_emergencia"));
        setContactos(todos.filter((n) => n.descripcion === "contacto_emergencia"));
      }
    } catch (error) {
      console.log("Error cargando números:", error);
    } finally {
      setLoading(false);
    }
  };

  const llamar = (numero: string) => Linking.openURL(`tel:${numero}`);

  const agregarContacto = async () => {
    if (!nuevoTitulo || !nuevoNumero) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await setNumero({
        titulo: nuevoTitulo,
        telefono: nuevoNumero,
        descripcion: "contacto_emergencia",
      });

      if (res.status === "ok") {
        setContactos((prev) => [...prev, { id: res.id, titulo: nuevoTitulo, numero: nuevoNumero }]);
        setNuevoTitulo("");
        setNuevoNumero("");
      } else {
        alert(res.message || "Error al agregar contacto");
      }
    } catch (error) {
      console.log(error);
      alert("Error al agregar contacto");
    }
  };

  const confirmarEliminar = (contacto: NumeroUtil) => {
    setNumeroAEliminar(contacto);
    setModalVisible(true);
  };

  const eliminarContacto = async () => {
    if (!numeroAEliminar) return;

    try {
      const res = await deleteNumero(numeroAEliminar.id);
      if (res.status === "ok") {
        setContactos((prev) => prev.filter((c) => c.id !== numeroAEliminar.id));
      } else {
        alert(res.message || "Error al eliminar contacto");
      }
    } catch (error) {
      console.log(error);
      alert("Error al eliminar contacto");
    } finally {
      setModalVisible(false);
      setNumeroAEliminar(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // ajusta según tu header
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.seccionTitle}>Números prestablecidos</Text>
        {numeros.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.numero}>{item.numero}</Text>
            </View>
            <TouchableOpacity style={styles.boton} onPress={() => llamar(item.numero)}>
              <Text style={styles.botonTexto}>Llamar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.seccionTitle}>Contactos de emergencia</Text>
        {contactos.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.numero}>{item.numero}</Text>
            </View>
            <TouchableOpacity style={styles.boton} onPress={() => llamar(item.numero)}>
              <Text style={styles.botonTexto}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: "#aaa", marginLeft: 5 }]}
              onPress={() => confirmarEliminar(item)}
            >
              <Text style={styles.botonTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.seccionTitle, { marginTop: 20 }]}>Agregar contacto de emergencia</Text>
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={nuevoTitulo}
          onChangeText={setNuevoTitulo}
        />
        <TextInput
          placeholder="Número"
          style={styles.input}
          value={nuevoNumero}
          onChangeText={setNuevoNumero}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarContacto}>
          <Text style={styles.botonTexto}>Agregar Contacto</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                ¿Estás seguro que quieres eliminar {numeroAEliminar?.titulo}?
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.boton, { backgroundColor: "#E53935" }]}
                  onPress={eliminarContacto}
                >
                  <Text style={styles.botonTexto}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.boton, { backgroundColor: "#aaa" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.botonTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  seccionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  numero: { fontSize: 16, color: "#666" },
  boton: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  botonTexto: { color: "white", fontWeight: "bold" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  botonAgregar: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalText: { fontSize: 16, textAlign: "center" },
});
