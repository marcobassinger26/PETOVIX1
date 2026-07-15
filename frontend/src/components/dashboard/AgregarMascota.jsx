import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalesService } from '../../services/animalesService';
import Navbar from '../common/Navbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FondoPetovix from '../common/FondoPetovix';

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
          ? 'border-emerald-400 bg-emerald-50/80 shadow-md shadow-emerald-900/10 scale-105'
          : 'border-teal-100 bg-white/70 hover:border-emerald-300 hover:shadow-sm'
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
      <span className={`text-xs font-bold mt-1 ${seleccionada ? 'text-emerald-700' : 'text-teal-800/60'}`}>
        {especie.label}
      </span>
      {seleccionada && (
        <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 inline-block" />
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
    <FondoPetovix>
      <Navbar />

      <div className="container mx-auto p-4 md:p-8 max-w-3xl">

        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="boton-petovix-secundario aparecer mb-6 !py-2 !px-4 text-sm flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Volver
        </button>

        <div className="tarjeta-petovix aparecer overflow-hidden relative">

          {/* OVERLAY DE ÉXITO */}
          {exito && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center aparecer">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="text-5xl">🐾</span>
              </div>
              <h3 className="text-4xl font-bold titulo-degradado mb-2">¡Éxito!</h3>
              <p className="text-xl text-teal-900 font-medium">Paciente registrado correctamente.</p>
              <p className="text-sm text-teal-800/50 mt-4 animate-pulse">Abriendo expediente clínico...</p>
            </div>
          )}

          {/* Encabezado */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-14 -left-8 w-52 h-52 bg-teal-300/20 rounded-full blur-3xl" />
            </div>
            <h2 className="relative z-10 text-3xl font-bold">🐾 Registrar Nuevo Paciente</h2>
            <p className="relative z-10 opacity-90 mt-1">Ingresa los datos del nuevo animal al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-sm aparecer">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Nombre *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange}
                  className="input-petovix !p-3"
                  placeholder="Ej: Max" />
              </div>

              {/* Microchip */}
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Microchip / Código *</label>
                <input type="text" name="numero_microchip" required value={formData.numero_microchip} onChange={handleChange}
                  className="input-petovix !p-3 font-mono"
                  placeholder="Ej: MC-9988..." />
              </div>

            </div>

            {/* SELECTOR DE ESPECIE CON LOTTIE */}
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-3">Especie</label>
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
                <label className="block text-sm font-bold text-teal-900 mb-1">Raza</label>
                <input type="text" name="raza" value={formData.raza} onChange={handleChange}
                  className="input-petovix !p-3"
                  placeholder="Ej: Labrador" />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange}
                  className="input-petovix !p-3">
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* Fecha Nacimiento */}
              <div>
                <label className="block text-sm font-bold text-teal-900 mb-1">Fecha de Nacimiento</label>
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange}
                  className="input-petovix !p-3" />
              </div>

            </div>

            {/* Alergias */}
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-1">Alertas Médicas / Alergias (Opcional)</label>
              <textarea name="alergias" value={formData.alergias} onChange={handleChange} rows="2"
                className="w-full bg-white/80 border border-red-100 rounded-xl p-3 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none placeholder:text-teal-800/40"
                placeholder="Alergias a medicamentos, condiciones previas..."></textarea>
            </div>

            {/* Botón Guardar */}
            <button type="submit" disabled={loading || exito}
              className="boton-petovix w-full !py-4">
              {loading && !exito ? 'Guardando Paciente...' : '➕ Registrar Paciente'}
            </button>

          </form>
        </div>
      </div>
    </FondoPetovix>
  );
}