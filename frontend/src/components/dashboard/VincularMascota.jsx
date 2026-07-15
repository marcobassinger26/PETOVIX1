import { useState } from 'react';

export default function VincularMascota({ onVincular }) {
  const [chipInput, setChipInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chipInput.trim()) return;

    setLoading(true);
    try {
      await onVincular(chipInput);
      setChipInput(''); // Limpiar después de vincular
    } catch (error) {
      // El error se maneja en el componente padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative aparecer bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-900/20 mb-8 text-white overflow-hidden">

      {/* Manchas decorativas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-14 left-1/4 w-52 h-52 bg-teal-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">🔗 Vincular Nueva Mascota</h2>
          <p className="opacity-90 text-sm">
            Ingresa el número de Chip que te dio el veterinario para agregar a tu mascota aquí.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Ej: 981098..."
            className="flex-1 md:w-64 px-4 py-3 rounded-full text-teal-900 bg-white/90 backdrop-blur focus:outline-none focus:ring-4 focus:ring-white/40 shadow-inner placeholder:text-teal-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
            value={chipInput}
            onChange={(e) => setChipInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !chipInput.trim()}
            className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold hover:bg-teal-50 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      </div>
    </div>
  );
}