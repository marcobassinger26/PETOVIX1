// URLs y configuración
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Roles de usuario
export const ROLES = {
  VETERINARIO: 'Veterinario',
  TUTOR: 'Tutor',
  ADMIN: 'Admin'
};

// Tipos de eventos médicos
export const TIPOS_EVENTO = {
  VACUNA: 'Vacuna',
  DESPARASITACION: 'Desparasitacion',
  ESTUDIO: 'Estudio',
  NOTA_MEDICA: 'Nota Medica'
};

// Imagen por defecto
export const DEFAULT_PET_IMAGE = 'https://cdn-icons-png.flaticon.com/512/616/616408.png';

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  CONEXION: 'Error de conexión con el servidor',
  NO_AUTORIZADO: 'No tienes permisos para realizar esta acción',
  SESION_EXPIRADA: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
  DATOS_INVALIDOS: 'Los datos ingresados no son válidos'
};