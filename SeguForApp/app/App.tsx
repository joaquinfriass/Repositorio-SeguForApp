import { AuthProvider } from "@/components/src/context/AuthContext";
import AppNavigator from "@/components/src/navigation/AppNavigator";
import React from "react";

export default function App() {
  return (
    <AuthProvider> 
        <AppNavigator />
    </AuthProvider>
  );
}
