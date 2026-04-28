import { useNavigate } from 'react-router-dom';
import { DEFAULT_PET_IMAGE } from '../../utils/constants';

export default function MascotaCard({ animal }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group cursor-pointer">
      {/* Imagen de la mascota */}
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img 
          src={animal.url_foto || DEFAULT_PET_IMAGE} 
          alt={animal.nombre} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge de estado */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm">
          {animal.estado}
        </div>
      </div>
      
      {/* Información de la mascota */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{animal.nombre}</h3>
            <p className="text-sm text-gray-500">{animal.raza} • {animal.sexo}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-bold uppercase">
            {animal.especie}
          </span>
        </div>
        
        {/* Información del chip */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-bold mr-2">CHIP:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {animal.numero_microchip}
            </span>
          </div>
        </div>

        {/* Botón para ver expediente */}
        <button 
          onClick={() => navigate(`/expediente/${animal.id_animal}`)}
          className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-700 text-sm transition-colors"
        >
          Ver Expediente Completo
        </button>
      </div>
    </div>
  );
}