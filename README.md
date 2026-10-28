# 🩺VetCare Web

Interfaz web de VetCare, un sistema para gestionar una clínica veterinaria. Consume la API REST de [vetcare-api](https://github.com/martiny-developer/vetcare-api) y adapta lo que muestra según el rol del usuario.

> **Demo en línea:** https://martiny-developer.github.io/vetcare-web/
>
> La API corre en un plan gratuito que se apaga por inactividad: el primer inicio de sesión puede tardar hasta un minuto. La pantalla de login lo avisa mientras espera.

## Captura

<img width="1228" height="593" alt="image" src="https://github.com/user-attachments/assets/f365e942-7713-4bf2-a7f6-da02542a0d44" />

## Cuentas de demostración

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Vetcare2026` | ADMIN |
| `recepcion1` | `clave1234` | RECEPCIONISTA |
| `veterinario1` | `clave1234` | VETERINARIO |

Son cuentas de prueba con datos ficticios.

## Tecnologías

- Angular 22 con componentes standalone y signals
- TypeScript y RxJS
- Formularios reactivos
- Bootstrap 5 y Bootstrap Icons
- GitHub Actions y GitHub Pages para el despliegue

## Funcionalidades

- Inicio de sesión con token JWT y cierre de sesión.
- Panel de inicio con totales de dueños, mascotas y citas pendientes, y la lista de próximas citas.
- Dueños y mascotas: listar, crear, editar y eliminar.
- Citas: agendar, atender y eliminar, con selección de mascota y veterinario.
- Botones y formularios visibles según el rol (`ADMIN`, `RECEPCIONISTA` o `VETERINARIO`).
- Mensajes de error claros cuando la API rechaza una operación.
- Aviso de espera mientras el servidor gratuito se despierta.

## Cómo está organizado

```
src/app/
├── core/        servicio de autenticación, interceptor del token y guards de rutas
├── features/    pantallas: login, inicio, dueños, mascotas y citas
├── models/      interfaces que reflejan los DTO de la API
└── services/    servicios que llaman a la API
```

Decisiones de diseño:

- **Interceptor HTTP:** agrega el token `Bearer` a cada petición hacia la API y cierra la sesión si el servidor responde 401.
- **Guards de ruta:** exigen sesión iniciada y, si hace falta, un rol concreto. Solo ocultan pantallas: la seguridad real está en la API.
- **Sesión en `sessionStorage`:** se borra al cerrar la pestaña.

## Ejecutar en local

Requisitos: Node.js compatible con Angular 22.

```bash
npm install
npm start
```

La aplicación queda en `http://localhost:4200`. La dirección de la API está en `src/environments/environment.ts`. Para trabajar con tu propia API local, cámbiala a `http://localhost:8080/api`.

## Despliegue

Cada vez que se sube código a la rama `main`, un flujo de GitHub Actions (`.github/workflows/deploy.yml`) compila la aplicación y la publica en GitHub Pages. Como Pages no conoce las rutas de Angular, el flujo copia `index.html` a `404.html` para que recargar una sección no dé error.

La API debe permitir el origen de la página publicada en su configuración de CORS.

## Autor

**Martiny** · Desarrollador Backend Java
