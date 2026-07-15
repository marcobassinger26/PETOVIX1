import { useState } from 'react';

export default function HistorialMedico({ historial, esVeterinario, onAgregarEvento, onEditarEvento, onEliminarEvento }) {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [eliminandoId, setEliminandoId] = useState(null); // para feedback visual

  const CATEGORIAS = [
    { id: 'Todos',           label: 'Todos',           icon: '' },
    { id: 'Vacuna',          label: 'Vacunas',          icon: '' },
    { id: 'Desparasitacion', label: 'Desparasitación',  icon: '' },
    { id: 'Estudio',         label: 'Estudios',         icon: '' },
    { id: 'Nota Medica',     label: 'Notas Médicas',    icon: '' },
  ];

  const historialFiltrado = (historial || []).filter(evento => {
    const porTipo  = filtroActivo === 'Todos' || evento.tipo_evento === filtroActivo;
    const porDesde = !fechaDesde || evento.fecha >= fechaDesde;
    const porHasta = !fechaHasta || evento.fecha <= fechaHasta;
    return porTipo && porDesde && porHasta;
  });

  const limpiarFechas = () => { setFechaDesde(''); setFechaHasta(''); };

  const handleEliminar = async (id_evento) => {
    const ok = window.confirm('¿Eliminar este evento del historial? Esta acción no se puede deshacer.');
    if (!ok) return;
    setEliminandoId(id_evento);
    try {
      await onEliminarEvento(id_evento);
    } catch {
      alert('Error al eliminar el evento.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800"> Historial Médico</h3>
        {esVeterinario && (
          <button
            onClick={onAgregarEvento}
            className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-800 transition shadow-sm"
          >
            + Nuevo Evento
          </button>
        )}
      </div>

      {/* Filtro tipo */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltroActivo(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filtroActivo === cat.id
                ? 'bg-green-800 text-white shadow-md'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            <span className="text-sm">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Filtro fecha */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">📅 Rango:</span>
        <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-green-400" />
        <span className="text-xs text-gray-400">—</span>
        <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-green-400" />
        {(fechaDesde || fechaHasta) && (
          <button onClick={limpiarFechas} className="text-xs text-red-400 hover:text-red-600 font-bold">✕ Limpiar</button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {historialFiltrado.length} resultado{historialFiltrado.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de eventos */}
      {historial && historial.length > 0 ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {historialFiltrado.length > 0 ? (
            historialFiltrado.map((evento) => (
              <div
                key={evento.id_evento}
                className={`border-l-4 border-green-500 bg-gray-50 p-3 rounded-r-lg hover:shadow-md transition ${eliminandoId === evento.id_evento ? 'opacity-40 pointer-events-none' : ''}`}
              >
                {/* Cabecera del evento */}
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-green-900 uppercase text-sm">{evento.tipo_evento}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded shadow-sm">{evento.fecha}</span>
                    {esVeterinario && (
                      <>
                        <button
                          onClick={() => onEditarEvento(evento)}
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded font-bold border border-blue-200 transition"
                          title="Editar evento"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleEliminar(evento.id_evento)}
                          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-bold border border-red-200 transition"
                          title="Eliminar evento"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-800 font-medium mt-2">{evento.descripcion_producto}</p>

                {/* Campos extra de vacuna */}
                {evento.tipo_evento === 'Vacuna' && (evento.lote_vacuna || evento.fecha_refuerzo || evento.peso_kg) && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {evento.lote_vacuna && (
                      <span className="text-blue-700"><span className="font-bold">Lote:</span> {evento.lote_vacuna}</span>
                    )}
                    {evento.peso_kg && (
                      <span className="text-blue-700"><span className="font-bold">Peso:</span> {evento.peso_kg} kg</span>
                    )}
                    {evento.fecha_refuerzo && (
                      <span className="col-span-2 text-orange-600 font-bold">
                        📅 Refuerzo: {new Date(evento.fecha_refuerzo + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                )}

                {/* Evidencia */}
                {evento.url_radiografia && (
                  <a href={evento.url_radiografia} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-200 transition">
                    📎 Ver Evidencia Adjunta
                  </a>
                )}

                {/* Firma */}
                {evento.url_firma && (
                  <a href={evento.url_firma} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 ml-2 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 font-bold border border-purple-200 transition">
                    🖊️ Ver Firma/Sello
                  </a>
                )}

                {/* Veterinaria + Médico */}
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <span className="text-green-600">Clínica:</span> {evento.veterinaria_nombre}
                  {evento.medico_nombre && (
                    <span className="ml-3"><span className="text-blue-500">👨‍⚕️</span> {evento.medico_nombre}</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Sin registros de <span className="font-bold lowercase">{CATEGORIAS.find(c => c.id === filtroActivo)?.label}</span> para esta fecha.
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