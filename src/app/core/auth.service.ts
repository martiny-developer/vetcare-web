import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RolUsuario } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly clave = 'vetcare_sesion';

  // La sesion guardada (token, usuario y rol). Si no hay sesion vale null.
  private readonly sesionActual = signal<LoginResponse | null>(this.leerSesion());

  readonly autenticado = computed(() => this.sesionActual() !== null);
  readonly rol = computed<RolUsuario | null>(() => this.sesionActual()?.rol ?? null);
  readonly username = computed(() => this.sesionActual()?.username ?? null);

  get token(): string | null {
    return this.sesionActual()?.token ?? null;
  }

  login(datos: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((respuesta) => {
        sessionStorage.setItem(this.clave, JSON.stringify(respuesta));
        this.sesionActual.set(respuesta);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.clave);
    this.sesionActual.set(null);
    this.router.navigate(['/login']);
  }

  private leerSesion(): LoginResponse | null {
    try {
      const texto = sessionStorage.getItem(this.clave);
      return texto ? (JSON.parse(texto) as LoginResponse) : null;
    } catch {
      return null;
    }
  }
}
