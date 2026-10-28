import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Dueno, DuenoRequest } from '../models/dueno.model';

@Injectable({ providedIn: 'root' })
export class DuenoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/duenos`;

  listar() {
    return this.http.get<Dueno[]>(this.url);
  }

  crear(datos: DuenoRequest) {
    return this.http.post<Dueno>(this.url, datos);
  }

  actualizar(id: number, datos: DuenoRequest) {
    return this.http.put<Dueno>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
