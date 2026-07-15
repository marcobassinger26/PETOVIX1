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
    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white flex flex-col sm:flex-row items-center gap-6 overflow-hidden">

      {/* 🫧 Manchas decorativas dentro del header */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 w-56 h-56 bg-teal-300/20 rounded-full blur-3xl" />
      </div>

      {/* FOTO DE PERFIL */}
      <div className="relative group z-10">
        <img
          src={animal.url_foto || DEFAULT_PET_IMAGE}
          alt={animal.nombre}
          className="w-32 h-32 rounded-full ring-4 ring-white/80 shadow-xl object-cover bg-white"
        />

        {/* 🔒 SOLO VETERINARIOS PUEDEN CAMBIAR LA FOTO */}
        {esVeterinario && (
          <label className="absolute bottom-0 right-0 bg-white text-teal-700 p-2 rounded-full shadow-lg cursor-pointer hover:bg-teal-50 transition transform hover:scale-110">
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
      <div className="relative z-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold drop-shadow-sm">{animal.nombre}</h1>
        <p className="text-teal-50/90 text-lg">{animal.raza} • {animal.sexo}</p>
        <div className="mt-3 inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-mono border border-white/30">
          🔖 Chip: {animal.numero_microchip}
        </div>
      </div>
    </div>
  );
}