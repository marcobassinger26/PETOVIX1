import { useState, useEffect } from 'react';
import { animalesService } from '../services/animalesService';

// usuarioCargado: bool — true cuando useAuth ya terminó de leer el localStorage
// esTutor: boolean — indica si el usuario es Tutor
// id_cliente: number | null — el id del cliente asociado al tutor
export function useMascotas(usuarioCargado = false, esTutor = false, id_cliente = null) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMascotas = async () => {
    // 🛡️ Si es tutor pero aún no tiene id_cliente, no hacemos nada
    if (esTutor && !id_cliente) {
      setMascotas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await animalesService.getAll(esTutor ? id_cliente : null);
      setMascotas(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error cargando mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🛡️ No hacer NADA hasta que useAuth haya terminado de cargar
    if (!usuarioCargado) return;
    cargarMascotas();
  }, [usuarioCargado, esTutor, id_cliente]);

  const buscarPorChip = async (chip) => {
    try {
      setLoading(true);
      setError(null);
      const data = await animalesService.getByChip(chip);
      setMascotas([data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se encontró mascota con ese chip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const vincularMascota = async (chip) => {
    try {
      setLoading(true);
      await animalesService.vincularPorChip(chip);
      await cargarMascotas();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mascotas,
    loading,
    error,
    cargarMascotas,
    buscarPorChip,
    vincularMascota
  };
}