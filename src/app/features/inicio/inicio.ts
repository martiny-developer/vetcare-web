import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { mensajeDeError } from '../../core/errores';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';
import { DuenoService } from '../../services/dueno.service';
import { MascotaService } from '../../services/mascota.service';

interface Resumen {
  duenos: number;
  mascotas: number;
  pendientes: number;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, DatePipe],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly duenoService = inject(DuenoService);
  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);

  protected readonly resumen = signal<Resumen | null>(null);
  protected readonly proximas = signal<Cita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    forkJoin({
      duenos: this.duenoService.listar(),
      mascotas: this.mascotaService.listar(),
      citas: this.citaService.listar(),
    }).subscribe({
      next: ({ duenos, mascotas, citas }) => {
        const pendientes = citas
          .filter((c) => c.estado === 'PENDIENTE')
          .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));

        this.resumen.set({
          duenos: duenos.length,
          mascotas: mascotas.length,
          pendientes: pendientes.length,
        });
        this.proximas.set(pendientes.slice(0, 5));
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }
}
