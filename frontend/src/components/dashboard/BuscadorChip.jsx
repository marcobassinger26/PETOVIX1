import { useState } from 'react';

export default function BuscadorChip({ onBuscar, onLimpiar }) {
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      onLimpiar();
      return;
    }
    
    setBuscando(true);
    try {
      await onBuscar(busqueda);
    } finally {
      setBuscando(false);
    }
  };

  const handleLimpiar = () => {
    setBusqueda('');
    onLimpiar();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 mb-8">
      <h2 className="text-lg font-bold text-gray-700 mb-4">🔍 Búsqueda General</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Escanear Microchip o ingresar código..." 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={buscando}
        />
        <button 
          type="submit"
          disabled={buscando}
          className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
        {busqueda && (
          <button 
            type="button"
            onClick={handleLimpiar}
            className="text-gray-500 underline hover:text-gray-700 px-4"
          >
            Ver todos
          </button>
        )}
      </form>
    </div>
  );
}