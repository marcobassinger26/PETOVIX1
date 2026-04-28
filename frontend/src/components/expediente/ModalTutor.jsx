import { useState } from 'react';

export default function ModalTutor({ onCerrar, onGuardar }) {
  const [loading, setLoading] = useState(false);
  const [modo, setModo] = useState('existente');
  
  // 🌟 NUEVO ESTADO: Guardará el código que escriba el veterinario (Ej: PET-A1B2C3)
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">

        {/* Header - Actualizado a los colores de PETOVIX */}
        <div className="bg-green-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">👤 Asignar Tutor</h3>
          <button onClick={onCerrar} className="text-white hover:text-green-200 text-2xl leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button type="button" onClick={() => setModo('existente')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              modo === 'existente'
                ? 'text-green-900 border-b-2 border-green-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🔑 Ingresar Código
          </button>
          <button type="button" onClick={() => setModo('nuevo')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              modo === 'nuevo'
                ? 'text-green-900 border-b-2 border-green-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ➕ Nuevo Cliente
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* 🌟 MODO: Cliente existente (AHORA POR CÓDIGO) */}
          {modo === 'existente' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Código Único de Cliente
              </label>
              <input 
                type="text" 
                required 
                placeholder="Ej: PET-A1B2C3"
                value={codigoTutor}
                // Convertimos a mayúsculas automáticamente para evitar errores
                onChange={(e) => setCodigoTutor(e.target.value.toUpperCase())} 
                className="w-full border rounded-lg p-3 focus:outline-none focus:border-green-600 text-sm font-mono text-center tracking-widest uppercase bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-3 text-center">
                Pídele al tutor que te dicte su código desde la sección "Mi Perfil".
              </p>
            </div>
          )}

          {/* MODO: Nuevo cliente */}
          {modo === 'nuevo' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo *</label>
                <input type="text" required placeholder="Ej: Juan Pérez García"
                  value={tutor.nombre_completo}
                  onChange={(e) => setTutor({ ...tutor, nombre_completo: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-green-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono *</label>
                <input type="tel" required placeholder="Ej: 5551234567"
                  value={tutor.telefono}
                  onChange={(e) => setTutor({ ...tutor, telefono: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-green-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Ej: juan@ejemplo.com"
                  value={tutor.email}
                  onChange={(e) => setTutor({ ...tutor, email: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-green-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                <input type="text" placeholder="Ej: Calle Ejemplo #123, Col. Centro"
                  value={tutor.direccion}
                  onChange={(e) => setTutor({ ...tutor, direccion: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-green-600 text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCerrar} disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50 transition-colors shadow-md">
              {loading ? 'Guardando...' : 'Asignar Tutor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}