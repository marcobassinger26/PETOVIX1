import api from './api';

export const authService = {
  // 🔐 Login de usuario
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // 📝 Registro de usuario
  register: async (nombre, email, password, rol = 'Veterinario') => {
    const response = await api.post('/auth/register', {
      nombre,
      email,
      password,
      rol
    });
    return response.data;
  },

  // 💾 Guardar datos de sesión
  saveSession: (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  // 🗑️ Limpiar sesión
  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // 👤 Obtener usuario actual
  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  // ✅ Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (datos) => {
    const response = await api.put('/auth/perfil', datos);
    return response.data;
  },

  
};