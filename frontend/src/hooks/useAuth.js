import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUsuario(userData);
    setLoading(false);
  }, []);

  // Roles correctamente separados (Administrador es su propio rol)
  const esAdministrador = usuario?.rol === 'Administrador';
  const esVeterinario   = usuario?.rol === 'Veterinario';
  const esTutor         = usuario?.rol === 'Tutor';

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    authService.saveSession(data.token, data.usuario);
    setUsuario(data.usuario);
  };

  const register = async (nombre, email, password, rol) => {
    await authService.register(nombre, email, password, rol);
  };

  const logout = () => {
    authService.clearSession();
    setUsuario(null);
  };

  // Actualiza el usuario en estado y en localStorage
  const actualizarUsuario = (nuevosDatos) => {
    const actualizado = { ...usuario, ...nuevosDatos };
    setUsuario(actualizado);
    localStorage.setItem('usuario', JSON.stringify(actualizado));
  };

  return {
    usuario,
    loading,
    esAdministrador,
    esVeterinario,
    esTutor,
    login,
    register,
    logout,
    actualizarUsuario,
    isAuthenticated: authService.isAuthenticated()
  };
}