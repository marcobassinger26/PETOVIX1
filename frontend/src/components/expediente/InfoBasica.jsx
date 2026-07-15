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

  // Calcular edad desde fecha_nacimiento
  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return null;
    const hoy = new Date();
    const nac = new Date(fechaNac);
    const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
    if (meses < 1) return 'Recién nacido';
    if (meses < 12) return `${meses} mes${meses > 1 ? 'es' : ''}`;
    const anios = Math.floor(meses / 12);
    const mesesRest = meses % 12;
    return mesesRest > 0 ? `${anios} año${anios > 1 ? 's' : ''} y ${mesesRest} mes${mesesRest > 1 ? 'es' : ''}` : `${anios} año${anios > 1 ? 's' : ''}`;
  };

  const edadCalculada = calcularEdad(animal?.fecha_nacimiento);

  if (!animal) return <p className="text-teal-800/50 italic">Cargando información...</p>;

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-teal-50 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4 border-b border-teal-100 pb-2">
        <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2">
          Información Básica
        </h3>
        {esVeterinario && !editando && (
          <button
            onClick={() => setEditando(true)}
            className="text-sm text-teal-700 font-bold hover:bg-teal-50 px-3 py-1 rounded-full transition"
          >
            ✏️ Editar
          </button>
        )}
      </div>

      <ul className="space-y-4 text-teal-800/80">
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px] text-teal-900">Especie:</span>
          <span className="bg-teal-50 text-teal-800 px-2 py-1 rounded-full text-sm uppercase font-semibold">{animal.especie}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px] text-teal-900">Raza:</span>
          <span>{animal.raza || 'No especificada'}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="font-bold min-w-[120px] text-teal-900">Fecha Nac:</span>
          <span>{animal.fecha_nacimiento || 'No registrada'}</span>
        </li>
        {edadCalculada && (
          <li className="flex items-center gap-2">
            <span className="font-bold min-w-[120px] text-teal-900">Edad:</span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-sm font-semibold">
              🎂 {edadCalculada}
            </span>
          </li>
        )}
        <li className="flex items-center gap-2 border-t border-teal-50 pt-3">
          <span className="font-bold min-w-[120px] text-teal-900">Estado Actual:</span>
          {editando ? (
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="input-petovix !w-auto text-sm"
            >
              <option value="Disponible">🟢 Disponible</option>
              <option value="En tratamiento">🟡 En tratamiento</option>
              <option value="Urgente">🔴 Urgente</option>
              <option value="Adoptado">🏠 Adoptado</option>
            </select>
          ) : (
            <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
              {animal.estado}
            </span>
          )}
        </li>
      </ul>

      {/* Sección de Alertas Médicas */}
      <div className="mt-6 bg-red-50/80 border-l-4 border-red-400 p-4 rounded-2xl shadow-sm">
        <h4 className="text-red-700 font-bold flex items-center gap-2 mb-1">
          ⚠️ Alertas Médicas
        </h4>
        {editando ? (
          <textarea
            className="w-full mt-2 p-3 text-sm bg-white/80 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"
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
        <div className="flex gap-3 mt-6 aparecer">
          <button
            onClick={handleGuardar}
            className="boton-petovix flex-1 text-sm"
          >
            💾 Guardar Cambios
          </button>
          <button
            onClick={() => {
                setEditando(false);
                setFormData({ estado: animal.estado, alergias: animal.alergias || '' });
            }}
            className="boton-petovix-secundario flex-1 text-sm"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}