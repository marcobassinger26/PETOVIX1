import { useState, useEffect } from 'react';
import { TIPOS_EVENTO } from '../../utils/constants';

// Campos extra que solo aparecen en Vacuna
function CamposVacuna({ data, onChange }) {
  return (
    <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 space-y-3">
      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">💉 Datos de Vacuna</p>

      {/* Lote */}
      <div>
        <label className="block text-xs font-bold text-teal-900 mb-1">Lote de Vacuna</label>
        <input
          type="text"
          placeholder="Ej: LOT-2024-XA9"
          value={data.lote_vacuna}
          onChange={e => onChange('lote_vacuna', e.target.value)}
          className="input-petovix text-sm"
        />
      </div>

      {/* Fecha refuerzo */}
      <div>
        <label className="block text-xs font-bold text-teal-900 mb-1">
          Fecha de Refuerzo <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.fecha_refuerzo}
          onChange={e => onChange('fecha_refuerzo', e.target.value)}
          className="input-petovix text-sm !border-emerald-200"
        />
        {data.fecha_refuerzo && (
          <p className="text-xs text-emerald-600 mt-1">
            📅 Próximo refuerzo: {new Date(data.fecha_refuerzo + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Peso */}
      <div>
        <label className="block text-xs font-bold text-teal-900 mb-1">Peso al momento (kg)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="200"
          placeholder="Ej: 4.5"
          value={data.peso_kg}
          onChange={e => onChange('peso_kg', e.target.value)}
          className="input-petovix text-sm"
        />
      </div>
    </div>
  );
}

export default function ModalEvento({ onCerrar, onGuardar, eventoEditar = null }) {
  const esEdicion = !!eventoEditar;

  const [loading, setLoading] = useState(false);
  const [evento, setEvento] = useState({
    tipo_evento: TIPOS_EVENTO.VACUNA,
    descripcion_producto: '',
    veterinaria_nombre: 'Korium Vet',
    medico_nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    lote_vacuna: '',
    fecha_refuerzo: '',
    peso_kg: '',
  });
  const [archivo, setArchivo] = useState(null);
  const [firmaArchivo, setFirmaArchivo] = useState(null);

  // Si venimos en modo edición, pre-llenamos el form
  useEffect(() => {
    if (eventoEditar) {
      setEvento({
        tipo_evento:          eventoEditar.tipo_evento          || TIPOS_EVENTO.VACUNA,
        descripcion_producto: eventoEditar.descripcion_producto || '',
        veterinaria_nombre:   eventoEditar.veterinaria_nombre   || 'Korium Vet',
        medico_nombre:        eventoEditar.medico_nombre        || '',
        fecha:                eventoEditar.fecha                || new Date().toISOString().split('T')[0],
        lote_vacuna:          eventoEditar.lote_vacuna          || '',
        fecha_refuerzo:       eventoEditar.fecha_refuerzo       || '',
        peso_kg:              eventoEditar.peso_kg              || '',
      });
    }
  }, [eventoEditar]);

  const handleCampo = (campo, valor) => setEvento(prev => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Limpiamos campos vacíos para no mandar strings vacíos
      const payload = { ...evento };
      if (!payload.lote_vacuna)    delete payload.lote_vacuna;
      if (!payload.fecha_refuerzo) delete payload.fecha_refuerzo;
      if (!payload.peso_kg)        delete payload.peso_kg;

      await onGuardar(payload, archivo, firmaArchivo);
      onCerrar();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden aparecer">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">
            {esEdicion ? '✏️ Editar Evento Médico' : '💉 Agregar Evento Médico'}
          </h3>
          <button onClick={onCerrar} className="text-white hover:text-teal-100 text-2xl leading-none transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Tipo de evento */}
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">Tipo de Evento</label>
            <select
              className="input-petovix"
              value={evento.tipo_evento}
              onChange={e => handleCampo('tipo_evento', e.target.value)}
            >
              <option value={TIPOS_EVENTO.VACUNA}>💉 Vacuna</option>
              <option value={TIPOS_EVENTO.DESPARASITACION}>💊 Desparasitación</option>
              <option value={TIPOS_EVENTO.ESTUDIO}>📋 Estudio</option>
              <option value={TIPOS_EVENTO.NOTA_MEDICA}>📝 Nota Médica</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">Descripción *</label>
            <input
              type="text"
              required
              placeholder="Ej: Vacuna antirrábica"
              className="input-petovix"
              value={evento.descripcion_producto}
              onChange={e => handleCampo('descripcion_producto', e.target.value)}
            />
          </div>

          {/* Fecha + Veterinaria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-1">Fecha</label>
              <input
                type="date"
                className="input-petovix"
                value={evento.fecha}
                onChange={e => handleCampo('fecha', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-1">Veterinaria / Clínica</label>
              <input
                type="text"
                className="input-petovix"
                value={evento.veterinaria_nombre}
                onChange={e => handleCampo('veterinaria_nombre', e.target.value)}
              />
            </div>
          </div>

          {/* Médico que aplicó */}
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">
              👨‍⚕️ Médico que aplicó
            </label>
            <input
              type="text"
              placeholder="Ej: Dr. Ramírez"
              className="input-petovix"
              value={evento.medico_nombre}
              onChange={e => handleCampo('medico_nombre', e.target.value)}
            />
          </div>

          {/* Campos extra para Vacuna */}
          {evento.tipo_evento === TIPOS_EVENTO.VACUNA && (
            <CamposVacuna data={evento} onChange={handleCampo} />
          )}

          {/* Evidencia (radiografía / documento) */}
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">
              Adjuntar Evidencia {esEdicion && eventoEditar?.url_radiografia && <span className="text-xs text-teal-800/50">(reemplazará la anterior)</span>}
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full text-sm text-teal-800/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 transition cursor-pointer"
              onChange={e => setArchivo(e.target.files[0])}
            />
          </div>

          {/* Firma / Sello */}
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">
              Firma Digital / Sello <span className="text-xs text-teal-800/50 font-normal">(opcional)</span>
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full text-sm text-teal-800/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100 transition cursor-pointer"
              onChange={e => setFirmaArchivo(e.target.files[0])}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCerrar} disabled={loading}
              className="boton-petovix-secundario flex-1"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="boton-petovix flex-1"
            >
              {loading ? 'Guardando...' : (esEdicion ? '💾 Actualizar' : '✅ Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}