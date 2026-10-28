import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { Citas } from './features/citas/citas';
import { Duenos } from './features/duenos/duenos';
import { Inicio } from './features/inicio/inicio';
import { Login } from './features/login/login';
import { Mascotas } from './features/mascotas/mascotas';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Inicio, canActivate: [authGuard], pathMatch: 'full' },
  { path: 'duenos', component: Duenos, canActivate: [authGuard] },
  { path: 'mascotas', component: Mascotas, canActivate: [authGuard] },
  { path: 'citas', component: Citas, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
