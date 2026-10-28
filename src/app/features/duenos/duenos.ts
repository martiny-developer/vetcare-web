import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { mensajeDeError } from '../../core/errores';
import { Dueno } from '../../models/dueno.model';
import { DuenoService } from '../../services/dueno.service';

@Component({
  selector: 'app-duenos',
  imports: [ReactiveFormsModule],
  templateUrl: './duenos.html',
})
export class Duenos implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly duenoService = inject(DuenoService);
  private readonly auth = inject(AuthService);

  protected readonly duenos = signal<Dueno[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editandoId = signal<number | null>(null);

  // Segun el rol se muestran u ocultan los botones (la seguridad real esta en la API)
  protected readonly puedeEditar = computed(() =>
    ['ADMIN', 'RECEPCIONISTA'].includes(this.auth.rol() ?? ''),
  );
  protected readonly puedeBorrar = computed(() => this.auth.rol() === 'ADMIN');

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    telefono: [''],
    direccion: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.duenoService.listar().subscribe({
      next: (lista) => {
        this.duenos.set(lista);
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

    const datos = this.formulario.getRawValue();
    const id = this.editandoId();
    const peticion =
      id === null ? this.duenoService.crear(datos) : this.duenoService.actualizar(id, datos);

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

  protected editar(dueno: Dueno): void {
    this.editandoId.set(dueno.id);
    this.formulario.setValue({
      nombre: dueno.nombre,
      telefono: dueno.telefono ?? '',
      direccion: dueno.direccion ?? '',
    });
  }

  protected cancelar(): void {
    this.editandoId.set(null);
    this.formulario.reset();
  }

  protected eliminar(dueno: Dueno): void {
    if (!confirm(`¿Eliminar a ${dueno.nombre}?`)) {
      return;
    }

    this.error.set(null);
    this.duenoService.eliminar(dueno.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeDeError(e)),
    });
  }
}
