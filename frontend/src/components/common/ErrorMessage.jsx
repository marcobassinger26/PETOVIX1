export default function ErrorMessage({ mensaje, onRetry, tipo = 'error' }) {
  // Estilos según tipo de mensaje
  const estilos = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '⚠️'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: '⚡'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'ℹ️'
    }
  };

  const estilo = estilos[tipo] || estilos.error;

  return (
    <div className={`${estilo.bg} border ${estilo.border} rounded-lg p-4 my-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{estilo.icon}</span>
        <div className="flex-1">
          <p className={`font-semibold ${estilo.text}`}>{mensaje}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className={`mt-2 text-sm ${estilo.text} hover:underline font-medium`}
            >
              Intentar nuevamente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}