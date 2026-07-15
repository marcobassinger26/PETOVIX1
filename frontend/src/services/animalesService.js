import api from './api';

export const animalesService = {
  getAll: async (id_cliente = null) => {
    const url = id_cliente ? `/animales?id_cliente=${id_cliente}` : `/animales`;
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/animales/${id}`);
    return response.data;
  },

  getByChip: async (chip) => {
    const response = await api.get(`/animales/chip/${chip}`);
    return response.data;
  },

  vincularPorChip: async (numero_microchip) => {
    const response = await api.post('/animales/vincular-chip', { numero_microchip });
    return response.data;
  },

  addEvento: async (id_animal, eventoData) => {
    const response = await api.post(`/animales/${id_animal}/historial`, eventoData);
    return response.data;
  },

  // ✏️ NUEVO: Editar evento del historial
  editarEvento: async (id_evento, datos) => {
    const response = await api.put(`/animales/historial/${id_evento}`, datos);
    return response.data;
  },

  // 🗑️ NUEVO: Eliminar evento del historial
  eliminarEvento: async (id_evento) => {
    const response = await api.delete(`/animales/historial/${id_evento}`);
    return response.data;
  },

  addTutor: async (id_animal, tutorData) => {
    const response = await api.post(`/animales/${id_animal}/tutor`, tutorData);
    return response.data;
  },

  create: async (mascotaData) => {
    const response = await api.post('/animales', mascotaData);
    return response.data;
  },

  update: async (id, datos) => {
    const response = await api.put(`/animales/${id}`, datos);
    return response.data;
  },

  updateTutor: async (id_cliente, datos) => {
    const response = await api.put(`/animales/tutor/${id_cliente}`, datos);
    return response.data;
  }
};