import { useState, useEffect } from 'react';
import { animalesService } from '../services/animalesService';
import { uploadService } from '../services/uploadService';

export function useExpediente(id_animal) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await animalesService.getById(id_animal);
      setAnimal(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error cargando expediente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_animal) { cargarDatos(); }
  }, [id_animal]);

  // 🌟 NUEVA FUNCIÓN: Para actualizar alertas y estado
  const actualizarAnimal = async (datos) => {
    try {
      await animalesService.update(id_animal, datos);
      await cargarDatos(); // Recarga la info para quitar el modo edición
    } catch (err) {
      console.error("Error al actualizar:", err);
      throw err;
    }
  };

  const agregarEvento = async (eventoData, archivo = null) => {
    try {
      const res = await animalesService.addEvento(id_animal, eventoData);
      if (archivo && res.id_evento) {
        await uploadService.uploadEvidencia(res.id_evento, archivo);
      }
      await cargarDatos();
      return res;
    } catch (err) { throw err; }
  };

  const agregarTutor = async (tutorData) => {
    try {
      await animalesService.addTutor(id_animal, tutorData);
      await cargarDatos();
    } catch (err) { throw err; }
  };

  const cambiarFoto = async (file) => {
    try {
      await uploadService.uploadFoto(id_animal, file);
      await cargarDatos();
    } catch (err) { throw err; }
  };

  const actualizarTutor = async (id_cliente, datos) => {
    try {
      await animalesService.updateTutor(id_cliente, datos);
      await cargarDatos(); // Recarga para ver los cambios
    } catch (err) {
      throw err;
    }
  };

  return {
    animal,
    loading,
    error,
    actualizarAnimal, // 👈 Ahora el componente puede usar esto
    agregarEvento,
    agregarTutor,
    cambiarFoto,
    actualizarTutor
  };
}