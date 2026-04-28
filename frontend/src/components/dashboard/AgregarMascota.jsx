import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalesService } from '../../services/animalesService';
import Navbar from '../common/Navbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Configuración de especies con sus animaciones Lottie
const ESPECIES = [
  {
    value: 'Perro',
    label: 'Perro',
    src: 'https://lottie.host/c7994a67-5a1d-4943-b11a-90545b1dec20/U0nC9Ntbbb.lottie'
  },
  {
    value: 'Gato',
    label: 'Gato',
    src: 'https://lottie.host/a20f1f32-b0e8-42ab-9cf8-0e3e3aebd34a/j5DXIdnigk.lottie'
  },
  {
    value: 'Ave',
    label: 'Ave',
    src: 'https://lottie.host/fd8efdf8-b20e-4480-acba-5c93e3e3e54d/iawNnFhBeI.lottie'
  },
  {
    value: 'Exótico',
    label: 'Exótico/otros',
    src: 'https://lottie.host/0e407308-b732-4fd9-8506-39828b0e1739/f2czheraqP.lottie'
  }
];

// Tarjeta individual de especie
function EspecieCard({ especie, seleccionada, onClick }) {
  const [lottieRef, setLottieRef] = useState(null);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => lottieRef?.play()}
      onMouseLeave={() => { if (!seleccionada) lottieRef?.stop(); }}
      className={`
        flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer
        ${seleccionada
          ? 'border-green-500 bg-green-50 shadow-md scale-105'
          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
        }
      `}
    >
      <div className="w-16 h-16">
        <DotLottieReact
          src={especie.src}
          loop
          autoplay={seleccionada}
          dotLottieRefCallback={(instance) => setLottieRef(instance)}
        />
      </div>
      <span className={`text-xs font-bold mt-1 ${seleccionada ? 'text-green-700' : 'text-gray-500'}`}>
        {especie.label}
      </span>
      {seleccionada && (
        <span className="mt-1 w-2 h-2 rounded-full bg-green-500 inline-block" />
      )}
    </button>
  );
}

export default function AgregarMascota() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    sexo: 'Macho',
    fecha_nacimiento: '',
    numero_microchip: '',
    estado: 'Disponible',
    alergias: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEspecieSelect = (value) => {
    setFormData({ ...formData, especie: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const nuevaMascota = await animalesService.create(formData);
      setExito(true);
      setTimeout(() => {
        navigate(`/expediente/${nuevaMascota.id_animal || nuevaMascota.id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar la mascota');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="container mx-auto p-4 md:p-8 max-w-3xl">

        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Volver
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">

          {/* OVERLAY DE ÉXITO */}
          {exito && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="text-5xl">🐾</span>
              </div>
              <h3 className="text-4xl font-bold text-green-800 mb-2">¡Éxito!</h3>
              <p className="text-xl text-gray-600 font-medium">Paciente registrado correctamente.</p>
              <p className="text-sm text-gray-400 mt-4 animate-pulse">Abriendo expediente clínico...</p>
            </div>
          )}

          {/* Encabezado */}
          <div className="bg-green-800 p-6 text-white text-center">
            <h2 className="text-3xl font-bold"> Registrar Nuevo Paciente</h2>
            <p className="opacity-80 mt-1">Ingresa los datos del nuevo animal al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Ej: Max" />
              </div>

              {/* Microchip */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Microchip / Código *</label>
                <input type="text" name="numero_microchip" required value={formData.numero_microchip} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 font-mono"
                  placeholder="Ej: MC-9988..." />
              </div>

            </div>

            {/* SELECTOR DE ESPECIE CON LOTTIE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Especie</label>
              <div className="grid grid-cols-4 gap-3">
                {ESPECIES.map((especie) => (
                  <EspecieCard
                    key={especie.value}
                    especie={especie}
                    seleccionada={formData.especie === especie.value}
                    onClick={() => handleEspecieSelect(especie.value)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Raza */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Raza</label>
                <input type="text" name="raza" value={formData.raza} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                  placeholder="Ej: Labrador" />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500">
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* Fecha Nacimiento */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500" />
              </div>

            </div>

            {/* Alergias */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Alertas Médicas / Alergias (Opcional)</label>
              <textarea name="alergias" value={formData.alergias} onChange={handleChange} rows="2"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Alergias a medicamentos, condiciones previas..."></textarea>
            </div>

            {/* Botón Guardar */}
            <button type="submit" disabled={loading || exito}
              className="w-full bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-800 transition-colors disabled:opacity-50">
              {loading && !exito ? 'Guardando Paciente...' : '➕ Registrar Paciente'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}