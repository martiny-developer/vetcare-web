import { DuenoResumen } from './resumenes.model';

// Coincide con MascotaResponseDTO del backend
export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string | null;
  edad: number | null;
  dueno: DuenoResumen;
}

// Coincide con MascotaRequestDTO del backend
export interface MascotaRequest {
  nombre: string;
  especie: string;
  raza: string | null;
  edad: number | null;
  duenoId: number;
}
