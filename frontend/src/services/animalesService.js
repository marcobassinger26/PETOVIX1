import api from './api';

export const animalesService = {
  // 🐾 Obtener todas las mascotas (o filtradas por cliente)
  getAll: async (id_cliente = null) => {
    let url;
    if (id_cliente) {
        url = `/animales?id_cliente=${id_cliente}`; // Tutor: solo sus mascotas
    } else {
        url = `/animales`; // Veterinario: todos los animales
    }
    const response = await api.get(url);
    return response.data;
},

  // 🔍 Obtener una mascota por ID
  getById: async (id) => {
    const response = await api.get(`/animales/${id}`);
    return response.data;
  },

  // 🏷️ Buscar por chip (Para que el veterinario busque)
  getByChip: async (chip) => {
    const response = await api.get(`/animales/chip/${chip}`);
    return response.data;
  },

  // 🚀 NUEVO Y AUTOMÁTICO: Vincular mascota a cliente (para tutores)
  vincularPorChip: async (numero_microchip) => {
    const response = await api.post('/animales/vincular-chip', { numero_microchip });
    return response.data;
  },

  // 💉 Agregar evento al historial (vacuna, desparasitación, etc)
  addEvento: async (id_animal, eventoData) => {
    const response = await api.post(`/animales/${id_animal}/historial`, eventoData);
    return response.data;
  },

  // 👤 Registrar tutor para una mascota (Desde la vista del veterinario)
  addTutor: async (id_animal, tutorData) => {
    const response = await api.post(`/animales/${id_animal}/tutor`, tutorData);
    return response.data;
  },
  
  // ➕ Agregar una nueva mascota al sistema
  create: async (mascotaData) => {
    const response = await api.post('/animales', mascotaData);
    return response.data;
  },

  // 📝 Actualizar datos de una mascota (Info básica, alertas, etc)
  update: async (id, datos) => {
    const response = await api.put(`/animales/${id}`, datos);
    return response.data;
  },

  // 👤 Actualizar datos del tutor
  updateTutor: async (id_cliente, datos) => {
    const response = await api.put(`/animales/tutor/${id_cliente}`, datos);
    return response.data;
  }
};