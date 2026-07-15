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
    <div className="tarjeta-petovix aparecer p-6 mb-8">
      <h2 className="text-lg font-bold text-teal-900 mb-4">🔍 Búsqueda General</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Escanear Microchip o ingresar código..."
          className="input-petovix flex-1 !py-3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={buscando}
        />
        <button
          type="submit"
          disabled={buscando}
          className="boton-petovix !px-8"
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
        {busqueda && (
          <button
            type="button"
            onClick={handleLimpiar}
            className="text-teal-700/70 underline hover:text-teal-900 px-4 font-medium transition-colors"
          >
            Ver todos
          </button>
        )}
      </form>
    </div>
  );
}