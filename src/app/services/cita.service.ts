import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Cita, CitaRequest } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/citas`;

  listar() {
    return this.http.get<Cita[]>(this.url);
  }

  crear(datos: CitaRequest) {
    return this.http.post<Cita>(this.url, datos);
  }

  atender(id: number) {
    return this.http.patch<Cita>(`${this.url}/${id}/atender`, null);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
