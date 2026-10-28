import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { mensajeDeError } from '../../core/errores';
import { Dueno } from '../../models/dueno.model';
import { Mascota, MascotaRequest } from '../../models/mascota.model';
import { DuenoService } from '../../services/dueno.service';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascotas',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './mascotas.html',
})
export class Mascotas implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly duenoService = inject(DuenoService);
  private readonly auth = inject(AuthService);

  protected readonly mascotas = signal<Mascota[]>([]);
  protected readonly duenos = signal<Dueno[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editandoId = signal<number | null>(null);

  protected readonly puedeEditar = computed(() =>
    ['ADMIN', 'RECEPCIONISTA'].includes(this.auth.rol() ?? ''),
  );
  protected readonly puedeBorrar = computed(() => this.auth.rol() === 'ADMIN');

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    especie: ['', [Validators.required, Validators.maxLength(255)]],
    raza: [''],
    edad: [null as number | null, [Validators.min(0)]],
    duenoId: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  // Se piden a la vez las mascotas y los duenos (para el desplegable)
  private cargar(): void {
    this.cargando.set(true);
    forkJoin({
      mascotas: this.mascotaService.listar(),
      duenos: this.duenoService.listar(),
    }).subscribe({
      next: ({ mascotas, duenos }) => {
        this.mascotas.set(mascotas);
        this.duenos.set(duenos);
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
    const datos: MascotaRequest = {
      nombre: valores.nombre.trim(),
      especie: valores.especie.trim(),
      raza: valores.raza.trim() || null,
      edad: valores.edad,
      duenoId: valores.duenoId as number,
    };

    const id = this.editandoId();
    const peticion =
      id === null
        ? this.mascotaService.crear(datos)
        : this.mascotaService.actualizar(id, datos);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelar();
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }

  protected editar(mascota: Mascota): void {
    this.editandoId.set(mascota.id);
    this.formulario.setValue({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza ?? '',
      edad: mascota.edad,
      duenoId: mascota.dueno.id,
    });
  }

  protected cancelar(): void {
    this.editandoId.set(null);
    this.formulario.reset();
  }

  protected eliminar(mascota: Mascota): void {
    if (!confirm(`¿Eliminar a ${mascota.nombre}?`)) {
      return;
    }

    this.error.set(null);
    this.mascotaService.eliminar(mascota.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeDeError(e)),
    });
  }
}
