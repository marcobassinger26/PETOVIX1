import { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // 👈 USA ESTO en vez de axios directo

export function useCitas() {
  const [citasHoy, setCitasHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCitasHoy = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/citas/hoy'); // 👈 sin http://localhost:3000
      setCitasHoy(data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearCita = async (datosCita) => {
    const { data } = await api.post('/citas', datosCita); // 👈 sin http://localhost:3000
    await cargarCitasHoy();
    return data;
  };

  const cancelarCita = async (id_cita) => {
    await api.delete(`/citas/${id_cita}`); // 👈 sin http://localhost:3000
    setCitasHoy(prev => prev.filter(c => c.id_cita !== id_cita));
  };

  useEffect(() => { cargarCitasHoy(); }, [cargarCitasHoy]);

  return { citasHoy, loading, crearCita, cancelarCita, cargarCitasHoy };
}