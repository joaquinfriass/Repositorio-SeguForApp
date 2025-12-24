// AppNavigator.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Tus pantallas existentes
import LoginScreen from "@/components/src/modules/auth/LoginScreen";
import RegisterScreen from "@/components/src/modules/auth/RegisterScreen";
import SosScreen from "@/components/src/modules/Emergencia/EmergenciaScreen";
import MapaScreen from "@/components/src/modules/mapa/MapaScreen";
import NumerosScreen from "@/components/src/modules/numeros/NumerosScreen";
import ReportesScreen from "@/components/src/modules/reportes/ReportesScreen";
import EditarPerfil from "@/components/src/modules/Usuario/EditarPerfil";
import PerfilScreen from "@/components/src/modules/Usuario/PerfilScreen";

// -------------------- Tipos --------------------
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  HomeTabs: undefined;
};

export type PerfilStackParamList = {
  PerfilMain: undefined;
  EditarPerfil: undefined;
};

export type RootTabParamList = {
  Mapa: undefined;
  SOS: undefined;
  Reportes: undefined;
  Numeros: undefined;
  Perfil: undefined;
};

// -------------------- Stack de Perfil --------------------
const PerfilStack = createNativeStackNavigator<PerfilStackParamList>();

function PerfilStackNavigator() {
  return (
    <PerfilStack.Navigator>
      <PerfilStack.Screen
        name="PerfilMain"
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />
      <PerfilStack.Screen
        name="EditarPerfil"
        component={EditarPerfil}
        options={{ title: "Editar Perfil" }}
      />
    </PerfilStack.Navigator>
  );
}

// -------------------- Tabs principales --------------------
const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Mapa: "map",
            SOS: "alert-circle",
            Reportes: "chatbubbles",
            Numeros: "call",
            Perfil: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#E53935",
        tabBarInactiveTintColor: "#999",
      })}
    >
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="SOS" component={SosScreen} />
      <Tab.Screen name="Reportes" component={ReportesScreen} />
      <Tab.Screen name="Numeros" component={NumerosScreen} />
      <Tab.Screen
        name="Perfil"
        component={PerfilStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// -------------------- Stack principal --------------------
const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="HomeTabs" component={HomeTabs} />
    </RootStack.Navigator>
  );
}
