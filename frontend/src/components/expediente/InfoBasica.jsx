import { useState, useEffect } from 'react';

export default function InfoBasica({ animal, esVeterinario, onActualizar }) {
  const [editando, setEditando] = useState(false);
  
  // 1. Inicializamos el estado vacío para evitar errores de renderizado
  const [formData, setFormData] = useState({
    estado: '',
    alergias: ''
  });

  // 2. 🌟 ESTA ES LA CLAVE: Cuando el animal cargue, llenamos el formulario
  useEffect(() => {
    if (animal) {
      setFormData({
        estado: animal.estado || 'Disponible',
        alergias: animal.alergias || ''
      });
    }
  }, [animal]);

  const handleGuardar = async () => {
    try {
      await onActualizar(formData);
      setEditando(false);
    } catch (error) {
      alert("Error al actualizar los datos");
    }
  };

  // Si aún no hay datos del animal, mostramos un mensaje simple
  if (!animal) return <p className="text-gray-400 italic">Cargando información...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📋 Información Básica
        </h3>
        {esVeterinario && !editando && (
          <button 
            onClick={() => setEditando(true)} 
            className="text-sm text-green-700 font-bold hover:bg-green-50 px-3 py-1 rounded-lg transition"
          >
            ✏️ Editar
          </button>
        )}
      </div>

      <ul className="space-y-4 text-gray-600">
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px]">Especie:</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm uppercase">{animal.especie}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px]">Raza:</span>
          <span>{animal.raza || 'No especificada'}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px]">Fecha Nac:</span>
          <span>{animal.fecha_nacimiento || 'No registrada'}</span>
        </li>
        <li className="flex items-center gap-2 border-t pt-3">
          <span className="font-bold min-w-[120px]">Estado Actual:</span>
          {editando ? (
            <select 
              value={formData.estado} 
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="border-2 border-green-200 rounded-lg px-2 py-1 text-sm focus:border-green-500 outline-none"
            >
              <option value="Disponible">🟢 Disponible</option>
              <option value="En tratamiento">🟡 En tratamiento</option>
              <option value="Urgente">🔴 Urgente</option>
              <option value="Adoptado">🏠 Adoptado</option>
            </select>
          ) : (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
              {animal.estado}
            </span>
          )}
        </li>
      </ul>

      {/* Sección de Alertas Médicas */}
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
        <h4 className="text-red-700 font-bold flex items-center gap-2 mb-1">
          ⚠️ Alertas Médicas
        </h4>
        {editando ? (
          <textarea 
            className="w-full mt-2 p-3 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 transition-all"
            rows="3"
            value={formData.alergias}
            onChange={(e) => setFormData({...formData, alergias: e.target.value})}
            placeholder="Escribe alergias, cirugías previas o cuidados especiales..."
          />
        ) : (
          <p className="text-red-600 text-sm mt-1 font-medium">
            {animal.alergias || "Sin alertas registradas hasta el momento."}
          </p>
        )}
      </div>

      {/* Botones de Guardado (Solo visibles en modo edición) */}
      {editando && (
        <div className="flex gap-3 mt-6 animate-pulse-in">
          <button 
            onClick={handleGuardar} 
            className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-800 shadow-lg transition-all"
          >
            💾 Guardar Cambios
          </button>
          <button 
            onClick={() => {
                setEditando(false);
                setFormData({ estado: animal.estado, alergias: animal.alergias || '' });
            }} 
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-300 transition-all"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}