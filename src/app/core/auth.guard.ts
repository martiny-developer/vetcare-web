import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RolUsuario } from '../models/auth.model';
import { AuthService } from './auth.service';

// Exige haber iniciado sesion; si no, redirige al login
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.autenticado() ? true : router.createUrlTree(['/login']);
};

// Exige uno de los roles indicados; si no, redirige al inicio
// Ejemplo de uso: canActivate: [rolGuard('ADMIN', 'VETERINARIO')]
export const rolGuard =
  (...roles: RolUsuario[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.rol();
    return rol !== null && roles.includes(rol) ? true : router.createUrlTree(['/']);
  };
