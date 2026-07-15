import { useState } from 'react';

export default function ModalTutor({ onCerrar, onGuardar }) {
  const [loading, setLoading] = useState(false);
  const [modo, setModo] = useState('existente');

  // 🌟 Guardará el código que escriba el veterinario (Ej: PET-A1B2C3)
  const [codigoTutor, setCodigoTutor] = useState('');

  const [tutor, setTutor] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modo === 'existente') {
        // 🚀 Enviamos el código exacto al backend en lugar de un ID de la lista
        await onGuardar({ codigo_tutor: codigoTutor });
      } else {
        await onGuardar(tutor);
      }
      onCerrar();
    } catch (error) {
      alert("Error registrando tutor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden aparecer">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">👤 Asignar Tutor</h3>
          <button onClick={onCerrar} className="text-white hover:text-teal-100 text-2xl leading-none transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-teal-100">
          <button type="button" onClick={() => setModo('existente')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              modo === 'existente'
                ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50'
                : 'text-teal-800/40 hover:text-teal-700'
            }`}
          >
            🔑 Ingresar Código
          </button>
          <button type="button" onClick={() => setModo('nuevo')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              modo === 'nuevo'
                ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50'
                : 'text-teal-800/40 hover:text-teal-700'
            }`}
          >
            ➕ Nuevo Cliente
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* 🌟 MODO: Cliente existente (POR CÓDIGO) */}
          {modo === 'existente' && (
            <div className="aparecer">
              <label className="block text-sm font-bold text-teal-900 mb-1">
                Código Único de Cliente
              </label>
              <input
                type="text"
                required
                placeholder="Ej: PET-A1B2C3"
                value={codigoTutor}
                // Convertimos a mayúsculas automáticamente para evitar errores
                onChange={(e) => setCodigoTutor(e.target.value.toUpperCase())}
                className="input-petovix !p-3 text-sm font-mono text-center tracking-widest uppercase"
              />
              <p className="text-xs text-teal-800/60 mt-3 text-center">
                Pídele al tutor que te dicte su código desde la sección "Mi Perfil".
              </p>
            </div>
          )}

          {/* MODO: Nuevo cliente */}
          {modo === 'nuevo' && (
            <div className="space-y-3 aparecer">
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Nombre Completo *</label>
                <input type="text" required placeholder="Ej: Juan Pérez García"
                  value={tutor.nombre_completo}
                  onChange={(e) => setTutor({ ...tutor, nombre_completo: e.target.value })}
                  className="input-petovix text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Teléfono *</label>
                <input type="tel" required placeholder="Ej: 5551234567"
                  value={tutor.telefono}
                  onChange={(e) => setTutor({ ...tutor, telefono: e.target.value })}
                  className="input-petovix text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Email</label>
                <input type="email" placeholder="Ej: juan@ejemplo.com"
                  value={tutor.email}
                  onChange={(e) => setTutor({ ...tutor, email: e.target.value })}
                  className="input-petovix text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Dirección</label>
                <input type="text" placeholder="Ej: Calle Ejemplo #123, Col. Centro"
                  value={tutor.direccion}
                  onChange={(e) => setTutor({ ...tutor, direccion: e.target.value })}
                  className="input-petovix text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCerrar} disabled={loading}
              className="boton-petovix-secundario flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="boton-petovix flex-1">
              {loading ? 'Guardando...' : 'Asignar Tutor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}