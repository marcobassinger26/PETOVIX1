import api from './api';

export const uploadService = {
  // 📸 Subir foto de perfil de mascota
  uploadFoto: async (id_animal, file) => {
    const formData = new FormData();
    formData.append('foto', file);
    
    const response = await api.post(`/upload/foto/${id_animal}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // 📄 Subir evidencia/radiografía de evento médico
  uploadEvidencia: async (id_evento, file) => {
    const formData = new FormData();
    formData.append('radiografia', file);
    
    const response = await api.post(`/upload/evidencia/${id_evento}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};