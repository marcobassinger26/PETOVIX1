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
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
            className="flex-1 md:w-64 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            value={chipInput}
            onChange={(e) => setChipInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !chipInput.trim()}
            className="bg-white text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      </div>
    </div>
  );
}