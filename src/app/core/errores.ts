import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error de la API en un mensaje que se puede mostrar al usuario
export function mensajeDeError(e: HttpErrorResponse): string {
  if (e.status === 0) {
    return 'No se pudo conectar con el servidor. Si es la primera vez, puede tardar hasta un minuto en despertar: intenta de nuevo.';
  }

  const cuerpo = e.error;

  // El backend responde {"error": "mensaje"} en la mayoria de los casos
  if (cuerpo && typeof cuerpo.error === 'string') {
    return cuerpo.error;
  }

  // Errores de validacion: {"campo": "mensaje", ...}
  if (e.status === 400 && cuerpo && typeof cuerpo === 'object') {
    return Object.values(cuerpo).join('. ');
  }

  if (e.status === 403) {
    return 'No tienes permiso para realizar esta acción';
  }

  return 'Ocurrió un error inesperado';
}
