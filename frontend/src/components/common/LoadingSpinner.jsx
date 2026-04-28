export default function LoadingSpinner({ mensaje = 'Cargando...', size = 'md' }) {
  // Tamaños disponibles
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`inline-block animate-spin rounded-full border-b-2 border-green-700 ${sizes[size]}`}></div>
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}
    </div>
  );
}