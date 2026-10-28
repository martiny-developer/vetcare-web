import { MascotaResumen } from './resumenes.model';

// Coincide con DuenoResponseDTO del backend
export interface Dueno {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  mascotas: MascotaResumen[];
}

// Coincide con DuenoRequestDTO del backend
export interface DuenoRequest {
  nombre: string;
  telefono: string;
  direccion: string;
}
