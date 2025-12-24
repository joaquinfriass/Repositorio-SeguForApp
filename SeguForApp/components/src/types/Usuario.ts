// components/src/types/Usuario.ts
export type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_registro?: string;
} | null;
