import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Mascota, MascotaRequest } from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mascotas`;

  listar() {
    return this.http.get<Mascota[]>(this.url);
  }

  crear(datos: MascotaRequest) {
    return this.http.post<Mascota>(this.url, datos);
  }

  actualizar(id: number, datos: MascotaRequest) {
    return this.http.put<Mascota>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
