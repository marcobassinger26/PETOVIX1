import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar el hook, busca si hay usuario guardado
  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUsuario(userData);
    setLoading(false);
  }, []);

  // Helpers para verificar roles
  const esVeterinario = usuario?.rol === 'Veterinario' || usuario?.rol === 'Admin';
  const esTutor = usuario?.rol === 'Tutor';

  // Función para hacer login
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    authService.saveSession(data.token, data.usuario);
    setUsuario(data.usuario);
  };

  // Función para registrarse
  const register = async (nombre, email, password, rol) => {
    await authService.register(nombre, email, password, rol);
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.clearSession();
    setUsuario(null);
  };

  return {
    usuario,
    loading,
    esVeterinario,
    esTutor,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };
}