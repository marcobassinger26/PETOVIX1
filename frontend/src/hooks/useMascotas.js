import { useState, useEffect } from 'react';
import { animalesService } from '../services/animalesService';

export function useMascotas(id_cliente = null) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📥 Función para cargar mascotas
  const cargarMascotas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await animalesService.getAll(id_cliente);
      setMascotas(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error cargando mascotas');
      console.error('Error cargando mascotas:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Cargar automáticamente cuando cambia el id_cliente
    useEffect(() => {
    // 👇 Si es tutor (id_cliente existe) esperamos a tenerlo antes de cargar
    // Si es veterinario (id_cliente = null) carga directo
    if (id_cliente !== undefined) {
        cargarMascotas();
    }}, [id_cliente]);

  // 🔍 Buscar mascota por chip
  const buscarPorChip = async (chip) => {
    try {
      setLoading(true);
      setError(null);
      const data = await animalesService.getByChip(chip);
      setMascotas([data]); // Mostrar solo la mascota encontrada
      return data;
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se encontró mascota con ese chip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔗 Vincular mascota a cliente (¡AHORA ES AUTOMÁTICO!)
  const vincularMascota = async (chip) => {
    try {
      setLoading(true); // Ponemos loading en true para que la pantalla de espera aparezca
      
      // Llamamos al servicio pasando ÚNICAMENTE el chip
      // ⚠️ Asegúrate de que en animalesService.js el método se llame 'vincularPorChip' o 'vincular' según lo hayas definido
      await animalesService.vincularPorChip(chip); 
      
      await cargarMascotas(); // Recarga la lista mágica y silenciosamente
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mascotas,        // Array de mascotas
    loading,         // true/false si está cargando
    error,           // Mensaje de error o null
    cargarMascotas,  // Función para recargar
    buscarPorChip,   // Función para buscar
    vincularMascota  // Función para vincular
  };
}