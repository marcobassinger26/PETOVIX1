import { useNavigate } from 'react-router-dom';
import { DEFAULT_PET_IMAGE } from '../../utils/constants';

export default function MascotaCard({ animal }) {
  const navigate = useNavigate();

  return (
    <div className="tarjeta-petovix tarjeta-petovix-hover overflow-hidden group cursor-pointer h-full flex flex-col">
      {/* Imagen de la mascota */}
      <div className="h-40 bg-teal-50 relative overflow-hidden">
        <img
          src={animal.url_foto || DEFAULT_PET_IMAGE}
          alt={animal.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge de estado */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-teal-800 shadow-sm">
          {animal.estado}
        </div>
      </div>

      {/* Información de la mascota */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-teal-900">{animal.nombre}</h3>
            <p className="text-sm text-teal-800/60">{animal.raza} • {animal.sexo}</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold uppercase">
            {animal.especie}
          </span>
        </div>

        {/* Información del chip */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-teal-800/70">
            <span className="font-bold mr-2 text-teal-900">CHIP:</span>
            <span className="font-mono bg-teal-50 px-2 py-1 rounded-full text-xs border border-teal-100">
              {animal.numero_microchip}
            </span>
          </div>
        </div>

        {/* Botón para ver expediente */}
        <button
          onClick={() => navigate(`/expediente/${animal.id_animal}`)}
          className="boton-petovix w-full mt-auto !mt-4 !py-2.5 text-sm"
        >
          Ver Expediente Completo
        </button>
      </div>
    </div>
  );
}