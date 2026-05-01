import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useCitas() {
  const [citasHoy, setCitasHoy] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarCitasHoy = useCallback(async () => {
    // No hacer petición si no hay token (usuario no logueado)
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/citas/hoy');
      setCitasHoy(data);
    } catch (error) {
      // Si es 401 simplemente limpiamos, el interceptor ya maneja el logout
      if (error.response?.status !== 401) {
        console.error('Error cargando citas:', error);
      }
      setCitasHoy([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearCita = async (datosCita) => {
    const { data } = await api.post('/citas', datosCita);
    await cargarCitasHoy();
    return data;
  };

  const cancelarCita = async (id_cita) => {
    await api.delete(`/citas/${id_cita}`);
    setCitasHoy(prev => prev.filter(c => c.id_cita !== id_cita));
  };

  useEffect(() => { cargarCitasHoy(); }, [cargarCitasHoy]);

  return { citasHoy, loading, crearCita, cancelarCita, cargarCitasHoy };
}