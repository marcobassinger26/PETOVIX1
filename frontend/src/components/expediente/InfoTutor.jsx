import { useState, useEffect } from 'react';

export default function InfoTutor({ animal, esVeterinario, onActualizarTutor, onAgregarTutor }) {
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false); // 👈 Para saber si está guardando
  const [guardadoOk, setGuardadoOk] = useState(false); // 👈 Para el check de éxito

  const tutor = animal.Cliente;

  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    if (tutor) {
      setFormData({
        nombre_completo: tutor.nombre_completo,
        telefono: tutor.telefono,
        email: tutor.email,
        direccion: tutor.direccion
      });
    }
  }, [tutor]);

  const handleGuardar = async () => {
    setCargando(true);
    try {
      await onActualizarTutor(tutor.id_cliente, formData);
      setGuardadoOk(true); // Mostramos señal de éxito

      // Esperamos un momento para que el usuario vea que funcionó y cerramos
      setTimeout(() => {
        setEditando(false);
        setGuardadoOk(false);
      }, 1500);

    } catch (error) {
      alert("Error al actualizar los datos del tutor");
    } finally {
      setCargando(false);
    }
  };

  if (!tutor) {
    return (
      <div className="bg-emerald-50/70 backdrop-blur-sm p-6 rounded-2xl border-2 border-dashed border-emerald-200 text-center">
        <p className="text-teal-800 font-medium mb-3">Esta mascota no tiene un tutor asignado.</p>
        {esVeterinario && (
          <button onClick={onAgregarTutor} className="boton-petovix text-sm !px-5 !py-2.5">
            ➕ Asignar Tutor
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-teal-50 shadow-sm relative overflow-hidden">

      {/* 🌟 Señal visual de éxito (Overlay verde suave) */}
      {guardadoOk && (
        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center z-10 aparecer">
            <span className="bg-white text-emerald-700 px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2">
               ✅ ¡Datos actualizados!
            </span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 border-b border-teal-100 pb-2">
        <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2">Tutor Responsable</h3>
        {esVeterinario && !editando && (
          <button onClick={() => setEditando(true)} className="text-sm text-teal-700 font-bold hover:bg-teal-50 px-3 py-1 rounded-full transition">
            ✏️ Editar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {editando ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
                <label className="text-[10px] font-bold text-teal-700/60 uppercase ml-1">Nombre Completo</label>
                <input type="text" value={formData.nombre_completo} onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} className="input-petovix text-sm" />

                <label className="text-[10px] font-bold text-teal-700/60 uppercase ml-1">Teléfono de Contacto</label>
                <input type="text" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="input-petovix text-sm" />

                <label className="text-[10px] font-bold text-teal-700/60 uppercase ml-1">Correo Electrónico</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-petovix text-sm" />

                <label className="text-[10px] font-bold text-teal-700/60 uppercase ml-1">Dirección Particular</label>
                <input type="text" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="input-petovix text-sm" />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleGuardar}
                disabled={cargando}
                className="boton-petovix flex-1 text-sm !py-2.5"
              >
                {cargando ? 'Guardando...' : '💾 Guardar'}
              </button>
              <button
                onClick={() => setEditando(false)}
                disabled={cargando}
                className="boton-petovix-secundario flex-1 text-sm !py-2.5"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="aparecer">
            <p className="text-teal-900 py-1"><span className="text-teal-700/50 font-bold text-xs uppercase mr-2">Nombre:</span> {tutor.nombre_completo}</p>
            <p className="text-teal-900 py-1"><span className="text-teal-700/50 font-bold text-xs uppercase mr-2">Teléfono:</span> {tutor.telefono}</p>
            <p className="text-teal-900 py-1"><span className="text-teal-700/50 font-bold text-xs uppercase mr-2">Email:</span> {tutor.email}</p>
            <p className="text-teal-900 py-1"><span className="text-teal-700/50 font-bold text-xs uppercase mr-2">Dirección:</span> {tutor.direccion || 'No registrada'}</p>
          </div>
        )}
      </div>
    </div>
  );
}