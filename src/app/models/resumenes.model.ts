// Versiones cortas de las entidades, iguales a los DTO "Resumen" del backend

export interface MascotaResumen {
  id: number;
  nombre: string;
  especie: string;
}

export interface DuenoResumen {
  id: number;
  nombre: string;
}

export interface VeterinarioResumen {
  id: number;
  nombre: string;
}
