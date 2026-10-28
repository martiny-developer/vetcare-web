import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Veterinario } from '../models/veterinario.model';

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/veterinarios`;

  listar() {
    return this.http.get<Veterinario[]>(this.url);
  }
}
