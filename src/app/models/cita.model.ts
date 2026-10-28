import { MascotaResumen, VeterinarioResumen } from './resumenes.model';

export type EstadoCita = 'PENDIENTE' | 'ATENDIDA' | 'CANCELADA';

// Coincide con CitaResponseDTO del backend
export interface Cita {
  id: number;
  fechaHora: string;
  motivo: string;
  estado: EstadoCita;
  mascota: MascotaResumen;
  veterinario: VeterinarioResumen;
}

// Coincide con CitaRequestDTO del backend
export interface CitaRequest {
  fechaHora: string;
  motivo: string;
  mascotaId: number;
  veterinarioId: number;
}
