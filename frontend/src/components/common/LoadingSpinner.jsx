export default function LoadingSpinner({ mensaje = 'Cargando...', size = 'md' }) {
  // Tamaños disponibles
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`inline-block animate-spin rounded-full border-emerald-500 border-t-transparent ${sizes[size]}`}></div>
      {mensaje && <p className="mt-4 text-teal-800/70 font-medium">{mensaje}</p>}
    </div>
  );
}