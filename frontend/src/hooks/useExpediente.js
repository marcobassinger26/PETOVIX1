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
    if (id_animal) cargarDatos();
  }, [id_animal]);

  const actualizarAnimal = async (datos) => {
    await animalesService.update(id_animal, datos);
    await cargarDatos();
  };

  const agregarEvento = async (eventoData, archivo = null) => {
    const res = await animalesService.addEvento(id_animal, eventoData);
    if (archivo && res.id_evento) {
      await uploadService.uploadEvidencia(res.id_evento, archivo);
    }
    await cargarDatos();
    return res;
  };

  // ✏️ NUEVO
  const editarEvento = async (id_evento, datos, archivoNuevo = null) => {
    await animalesService.editarEvento(id_evento, datos);
    if (archivoNuevo) {
      await uploadService.uploadEvidencia(id_evento, archivoNuevo);
    }
    await cargarDatos();
  };

  // 🗑️ NUEVO
  const eliminarEvento = async (id_evento) => {
    await animalesService.eliminarEvento(id_evento);
    await cargarDatos();
  };

  const agregarTutor = async (tutorData) => {
    await animalesService.addTutor(id_animal, tutorData);
    await cargarDatos();
  };

  const cambiarFoto = async (file) => {
    await uploadService.uploadFoto(id_animal, file);
    await cargarDatos();
  };

  const actualizarTutor = async (id_cliente, datos) => {
    await animalesService.updateTutor(id_cliente, datos);
    await cargarDatos();
  };

  return {
    animal, loading, error,
    actualizarAnimal,
    agregarEvento,
    editarEvento,
    eliminarEvento,
    agregarTutor,
    cambiarFoto,
    actualizarTutor
  };
}