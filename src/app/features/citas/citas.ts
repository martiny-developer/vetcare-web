import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { mensajeDeError } from '../../core/errores';
import { Cita, CitaRequest, EstadoCita } from '../../models/cita.model';
import { Mascota } from '../../models/mascota.model';
import { Veterinario } from '../../models/veterinario.model';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../services/mascota.service';
import { VeterinarioService } from '../../services/veterinario.service';

@Component({
  selector: 'app-citas',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './citas.html',
})
export class Citas implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly mascotaService = inject(MascotaService);
  private readonly veterinarioService = inject(VeterinarioService);
  private readonly auth = inject(AuthService);

  protected readonly citas = signal<Cita[]>([]);
  protected readonly mascotas = signal<Mascota[]>([]);
  protected readonly veterinarios = signal<Veterinario[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  // Permisos que muestran u ocultan botones (la seguridad real esta en la API)
  protected readonly puedeCrear = computed(() =>
    ['ADMIN', 'RECEPCIONISTA'].includes(this.auth.rol() ?? ''),
  );
  protected readonly puedeAtender = computed(() =>
    ['ADMIN', 'VETERINARIO'].includes(this.auth.rol() ?? ''),
  );
  protected readonly puedeBorrar = computed(() => this.auth.rol() === 'ADMIN');

  protected readonly formulario = this.fb.nonNullable.group({
    mascotaId: [null as number | null, [Validators.required]],
    veterinarioId: [null as number | null, [Validators.required]],
    fechaHora: ['', [Validators.required]],
    motivo: ['', [Validators.required, Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    forkJoin({
      citas: this.citaService.listar(),
      mascotas: this.mascotaService.listar(),
      veterinarios: this.veterinarioService.listar(),
    }).subscribe({
      next: ({ citas, mascotas, veterinarios }) => {
        // Las fechas vienen en formato ISO, asi que se pueden ordenar como texto
        this.citas.set([...citas].sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)));
        this.mascotas.set(mascotas);
        this.veterinarios.set(veterinarios);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const datos: CitaRequest = {
      // El campo de fecha entrega "2026-11-02T10:30"; se agregan los segundos
      fechaHora: valores.fechaHora.length === 16 ? `${valores.fechaHora}:00` : valores.fechaHora,
      motivo: valores.motivo.trim(),
      mascotaId: valores.mascotaId as number,
      veterinarioId: valores.veterinarioId as number,
    };

    this.citaService.crear(datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.formulario.reset();
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }

  protected atender(cita: Cita): void {
    this.error.set(null);
    this.citaService.atender(cita.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeDeError(e)),
    });
  }

  protected eliminar(cita: Cita): void {
    if (!confirm(`¿Eliminar la cita de ${cita.mascota.nombre}?`)) {
      return;
    }

    this.error.set(null);
    this.citaService.eliminar(cita.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeDeError(e)),
    });
  }

  protected claseEstado(estado: EstadoCita): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'text-bg-warning';
      case 'ATENDIDA':
        return 'text-bg-success';
      default:
        return 'text-bg-secondary';
    }
  }

  protected etiquetaVeterinario(v: Veterinario): string {
    return v.especialidades.length > 0
      ? `${v.nombre} (${v.especialidades.map((e) => e.nombre).join(', ')})`
      : v.nombre;
  }
}
