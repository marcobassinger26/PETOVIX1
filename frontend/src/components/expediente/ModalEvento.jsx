import { useState } from 'react';
import { TIPOS_EVENTO } from '../../utils/constants';

export default function ModalEvento({ onCerrar, onGuardar }) {
  const [loading, setLoading] = useState(false);
  const [evento, setEvento] = useState({
    tipo_evento: TIPOS_EVENTO.VACUNA,
    descripcion_producto: '',
    veterinaria_nombre: 'Korium Vet',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onGuardar(evento, archivo);
      onCerrar();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
        
        {/* Header */}
        <div className="bg-green-700 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">💉 Agregar Evento Médico</h3>
          <button 
            onClick={onCerrar}
            className="text-white hover:text-gray-200 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tipo de evento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tipo de Evento
            </label>
            <select 
              className="w-full border rounded p-2 focus:outline-none focus:border-green-500"
              value={evento.tipo_evento}
              onChange={(e) => setEvento({...evento, tipo_evento: e.target.value})}
            >
              <option value={TIPOS_EVENTO.VACUNA}>💉 Vacuna</option>
              <option value={TIPOS_EVENTO.DESPARASITACION}>💊 Desparasitación</option>
              <option value={TIPOS_EVENTO.ESTUDIO}>📋 Estudio</option>
              <option value={TIPOS_EVENTO.NOTA_MEDICA}>📝 Nota Médica</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Descripción
            </label>
            <input 
              type="text" 
              placeholder="Ej: Vacuna antirrábica"
              className="w-full border rounded p-2 focus:outline-none focus:border-green-500"
              required
              value={evento.descripcion_producto}
              onChange={(e) => setEvento({...evento, descripcion_producto: e.target.value})}
            />
          </div>

          {/* Fecha y Veterinaria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Fecha
              </label>
              <input 
                type="date"
                className="w-full border rounded p-2 focus:outline-none focus:border-green-500"
                value={evento.fecha}
                onChange={(e) => setEvento({...evento, fecha: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Veterinaria
              </label>
              <input 
                type="text"
                className="w-full border rounded p-2 focus:outline-none focus:border-green-500"
                value={evento.veterinaria_nombre}
                onChange={(e) => setEvento({...evento, veterinaria_nombre: e.target.value})}
              />
            </div>
          </div>

          {/* Archivo adjunto */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Adjuntar Evidencia (Opcional)
            </label>
            <input 
              type="file"
              accept="image/*,.pdf"
              className="w-full border rounded p-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}