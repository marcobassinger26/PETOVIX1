import { useState } from 'react';

export default function HistorialMedico({ historial, esVeterinario, onAgregarEvento }) {
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  // 🌟 DEFINIMOS LAS CATEGORÍAS FIJAS (Con los nombres exactos de tu Base de Datos)
  const CATEGORIAS = [
    { id: 'Todos', label: 'Todos', icon: '📂' },
    { id: 'Vacuna', label: 'Vacunas', icon: '💉' },
    { id: 'Desparasitacion', label: 'Desparasitación', icon: '💊' },
    { id: 'Estudio', label: 'Estudios', icon: '📋' },
   
    { id: 'Nota Medica', label: 'Notas Médicas', icon: '📝' }
  ];

  // Filtramos el historial dependiendo de la pestaña seleccionada
  const historialFiltrado = filtroActivo === 'Todos' 
    ? historial 
    : (historial || []).filter((evento) => evento.tipo_evento === filtroActivo);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">
          🏥 Historial Médico
        </h3>
        
        {/* 🔒 SOLO VETERINARIOS PUEDEN AGREGAR EVENTOS */}
        {esVeterinario && (
          <button 
            onClick={onAgregarEvento}
            className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-800 transition shadow-sm"
          >
            + Nuevo Evento
          </button>
        )}
      </div>

      {/* 🌟 BARRA DE FILTROS FIJA CON EMOJIS */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltroActivo(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filtroActivo === cat.id
                ? 'bg-green-800 text-white shadow-md' // Estilo pestaña activa
                : 'bg-green-100 text-green-800 hover:bg-green-200' // Estilo inactiva
            }`}
          >
            <span className="text-sm">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* LISTA DE EVENTOS */}
      {historial && historial.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {historialFiltrado.length > 0 ? (
            historialFiltrado.map((evento) => (
              <div 
                key={evento.id_evento} 
                className="border-l-4 border-green-500 bg-gray-50 p-3 rounded-r-lg hover:shadow-md transition animate-fade-in"
              >
                {/* Encabezado del evento */}
                <div className="flex justify-between items-start">
                  <span className="font-bold text-green-900 uppercase text-sm">
                    {evento.tipo_evento}
                  </span>
                  <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                    {evento.fecha}
                  </span>
                </div>
                
                {/* Descripción */}
                <p className="text-gray-800 font-medium mt-2">
                  {evento.descripcion_producto}
                </p>
                
                {/* Evidencia adjunta */}
                {evento.url_radiografia && (
                  <a 
                    href={evento.url_radiografia} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 mt-3 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-200 transition-colors"
                  >
                    📎 Ver Evidencia Adjunta
                  </a>
                )}
                
                {/* Veterinaria */}
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <span className="text-green-600">Vet:</span> {evento.veterinaria_nombre}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Aún no hay registros de <span className="font-bold lowercase">{CATEGORIAS.find(c => c.id === filtroActivo)?.label}</span> para esta mascota.
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No hay historial médico registrado aún.
        </p>
      )}
    </div>
  );
}