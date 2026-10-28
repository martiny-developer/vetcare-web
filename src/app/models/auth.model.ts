// Tipos que coinciden con los DTO del backend (LoginRequestDTO y LoginResponseDTO)

export type RolUsuario = 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: RolUsuario;
}
