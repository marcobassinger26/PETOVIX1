import { useState } from 'react';
import { DEFAULT_PET_IMAGE } from '../../utils/constants';

export default function HeaderExpediente({ animal, esVeterinario, onCambiarFoto }) {
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const handleCambioFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoFoto(true);
    try {
      await onCambiarFoto(file);
    } catch (error) {
      alert("Error subiendo foto: " + error.message);
    } finally {
      setSubiendoFoto(false);
    }
  };

  return (
    <div className="bg-green-800 p-8 text-white flex items-center gap-6 relative">
      {/* FOTO DE PERFIL */}
      <div className="relative group">
        <img 
          src={animal.url_foto || DEFAULT_PET_IMAGE} 
          alt={animal.nombre}
          className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
        />
        
        {/* 🔒 SOLO VETERINARIOS PUEDEN CAMBIAR LA FOTO */}
        {esVeterinario && (
          <label className="absolute bottom-0 right-0 bg-white text-green-800 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition transform hover:scale-110">
            📷
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleCambioFoto} 
              disabled={subiendoFoto}
            />
          </label>
        )}
        
        {subiendoFoto && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <span className="text-xs text-white">Subiendo...</span>
          </div>
        )}
      </div>

      {/* INFORMACIÓN BÁSICA */}
      <div>
        <h1 className="text-4xl font-bold">{animal.nombre}</h1>
        <p className="opacity-90 text-lg">{animal.raza} • {animal.sexo}</p>
        <div className="mt-2 inline-block bg-black/30 px-3 py-1 rounded text-sm font-mono">
          Chip: {animal.numero_microchip}
        </div>
      </div>
    </div>
  );
}