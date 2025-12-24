// components/src/context/AuthContext.tsx
import { Usuario } from "@/components/src/types/Usuario"; // importa el tipo desde un archivo aparte
import React, { createContext, useContext, useState } from "react";

// Definimos las funciones y datos que tendrá nuestro contexto
type AuthContextType = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  login: (usuario: Usuario) => void;
  logout: () => void;
};

// Creamos el contexto con valores iniciales por defecto
const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  login: () => {},
  logout: () => {},
});

// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Funciones para login/logout
  const login = (usuario: Usuario) => setUsuario(usuario);
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}
