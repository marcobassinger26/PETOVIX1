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
      <div className="flex justify-between items-center mb-4 border-b border-teal-100 pb-2">
        <h3 className="text-xl font-bold text-teal-900">Historial Médico</h3>
        {esVeterinario && (
          <button
            onClick={onAgregarEvento}
            className="text-sm font-bold text-white px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm hover:scale-105 transition-transform"
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
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            <span className="text-sm">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Filtro fecha */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-teal-50/60 rounded-xl p-3 border border-teal-100">
        <span className="text-xs font-bold text-teal-700/70 uppercase tracking-wide">📅 Rango:</span>
        <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
          className="border border-teal-100 bg-white/80 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-teal-400" />
        <span className="text-xs text-teal-800/40">—</span>
        <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
          className="border border-teal-100 bg-white/80 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-teal-400" />
        {(fechaDesde || fechaHasta) && (
          <button onClick={limpiarFechas} className="text-xs text-red-400 hover:text-red-600 font-bold">✕ Limpiar</button>
        )}
        <span className="ml-auto text-xs text-teal-800/50">
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
                className={`border-l-4 border-emerald-400 bg-white/70 backdrop-blur-sm border border-teal-50 p-3 rounded-r-2xl hover:shadow-md hover:shadow-teal-900/5 transition ${eliminandoId === evento.id_evento ? 'opacity-40 pointer-events-none' : ''}`}
              >
                {/* Cabecera del evento */}
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-teal-900 uppercase text-sm">{evento.tipo_evento}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">{evento.fecha}</span>
                    {esVeterinario && (
                      <>
                        <button
                          onClick={() => onEditarEvento(evento)}
                          className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 px-2 py-1 rounded-full font-bold border border-teal-200 transition"
                          title="Editar evento"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleEliminar(evento.id_evento)}
                          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-full font-bold border border-red-200 transition"
                          title="Eliminar evento"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-teal-900 font-medium mt-2">{evento.descripcion_producto}</p>

                {/* Campos extra de vacuna */}
                {evento.tipo_evento === 'Vacuna' && (evento.lote_vacuna || evento.fecha_refuerzo || evento.peso_kg) && (
                  <div className="mt-3 bg-emerald-50/80 border border-emerald-100 rounded-xl p-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {evento.lote_vacuna && (
                      <span className="text-teal-700"><span className="font-bold">Lote:</span> {evento.lote_vacuna}</span>
                    )}
                    {evento.peso_kg && (
                      <span className="text-teal-700"><span className="font-bold">Peso:</span> {evento.peso_kg} kg</span>
                    )}
                    {evento.fecha_refuerzo && (
                      <span className="col-span-2 text-amber-600 font-bold">
                        📅 Refuerzo: {new Date(evento.fecha_refuerzo + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                )}

                {/* Evidencia */}
                {evento.url_radiografia && (
                  <a href={evento.url_radiografia} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-100 font-bold border border-teal-200 transition">
                    📎 Ver Evidencia Adjunta
                  </a>
                )}

                {/* Firma */}
                {evento.url_firma && (
                  <a href={evento.url_firma} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 ml-2 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 font-bold border border-purple-200 transition">
                    🖊️ Ver Firma/Sello
                  </a>
                )}

                {/* Veterinaria + Médico */}
                <p className="text-xs text-teal-800/50 mt-3 flex items-center gap-1">
                  <span className="text-emerald-600 font-semibold">Clínica:</span> {evento.veterinaria_nombre}
                  {evento.medico_nombre && (
                    <span className="ml-3"><span className="text-teal-500">👨‍⚕️</span> {evento.medico_nombre}</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-teal-800/50 italic text-center py-8 bg-teal-50/50 rounded-2xl border border-dashed border-teal-200">
              Sin registros de <span className="font-bold lowercase">{CATEGORIAS.find(c => c.id === filtroActivo)?.label}</span> para esta fecha.
            </p>
          )}
        </div>
      ) : (
        <p className="text-teal-800/50 italic text-center py-8 bg-teal-50/50 rounded-2xl border border-dashed border-teal-200">
          No hay historial médico registrado aún.
        </p>
      )}
    </div>
  );
}