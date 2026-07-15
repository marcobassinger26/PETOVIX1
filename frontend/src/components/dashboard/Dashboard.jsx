import { useAuth } from '../../hooks/useAuth';
import { useMascotas } from '../../hooks/useMascotas';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import BuscadorChip from './BuscadorChip';
import MascotaCard from './MascotaCard';
import FondoPetovix from '../common/FondoPetovix';

export default function Dashboard() {
  const { usuario, esVeterinario, esAdministrador, esTutor, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ Esperamos a que useAuth termine antes de hacer cualquier fetch
  const {
    mascotas,
    loading,
    error,
    cargarMascotas,
    buscarPorChip
  } = useMascotas(!authLoading, esTutor, usuario?.id_cliente);

  const puedeVerTodos = esVeterinario || esAdministrador;

  const handleBuscar = async (chip) => {
    try {
      await buscarPorChip(chip);
    } catch {
      alert('No se encontró mascota con ese chip');
    }
  };

  return (
    <FondoPetovix>
      <Navbar />

      <div className="container mx-auto p-4 md:p-8">

        <button
          onClick={() => navigate('/')}
          className="boton-petovix-secundario aparecer mb-6 !py-2 !px-4 text-sm flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Volver al Inicio
        </button>

        {/* Buscador solo para Veterinarios y Admin */}
        {puedeVerTodos && (
          <BuscadorChip
            onBuscar={handleBuscar}
            onLimpiar={cargarMascotas}
          />
        )}

        {/* Banner informativo para Tutores */}
        {esTutor && (
          <div className="aparecer bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-900/20 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">🐾</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">¿Cómo vincular una mascota?</h2>
                <p className="opacity-90 text-sm">
                  Comparte tu <strong>Código de Tutor</strong> con el veterinario para que él asigne las mascotas a tu cuenta. Puedes verlo en tu perfil.
                </p>
              </div>
              <a href="/perfil"
                className="bg-white text-teal-700 px-5 py-2.5 rounded-full font-bold hover:bg-teal-50 hover:scale-105 transition-all shadow-md text-sm whitespace-nowrap"
              >
                Ver mi código →
              </a>
            </div>
          </div>
        )}

        <div className="aparecer mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-teal-900 flex items-center gap-2">
            {esTutor
              ? <>🐾 Mis <span className="titulo-degradado">Mascotas</span></>
              : <>📋 Pacientes <span className="titulo-degradado">Registrados</span></>}
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner mensaje="Cargando expedientes..." />
        ) : error ? (
          <ErrorMessage mensaje={error} onRetry={cargarMascotas} />
        ) : mascotas.length === 0 ? (
          <div className="tarjeta-petovix aparecer text-center py-20 border-dashed !border-teal-200">
            <p className="text-6xl mb-4 animate-bounce">🐾</p>
            <p className="text-teal-800/70 text-lg font-medium max-w-md mx-auto">
              {esTutor
                ? 'Aún no tienes mascotas asignadas. Pídele al veterinario que use tu código de tutor.'
                : 'No hay mascotas registradas en el sistema.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.map((animal, index) => (
              <div
                key={animal.id_animal}
                className="aparecer"
                style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
              >
                <MascotaCard animal={animal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </FondoPetovix>
  );
}