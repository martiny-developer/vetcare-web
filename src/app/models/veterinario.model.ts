export interface EspecialidadItem {
  id: number;
  nombre: string;
}

// Coincide con VeterinarioResponseDTO del backend
export interface Veterinario {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  especialidades: EspecialidadItem[];
}
