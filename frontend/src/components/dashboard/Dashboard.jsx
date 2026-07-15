import { useAuth } from '../../hooks/useAuth';
import { useMascotas } from '../../hooks/useMascotas';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import BuscadorChip from './BuscadorChip';
import MascotaCard from './MascotaCard';

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
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="container mx-auto p-4 md:p-8">

        <button
          onClick={() => navigate('/')}
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
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
          <div className="bg-gradient-to-r from-green-700 to-green-900 p-6 rounded-2xl shadow-lg mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">🐾</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">¿Cómo vincular una mascota?</h2>
                <p className="opacity-90 text-sm">
                  Comparte tu <strong>Código de Tutor</strong> con el veterinario para que él asigne las mascotas a tu cuenta. Puedes verlo en tu perfil.
                </p>
              </div>
              <a href="/perfil"
                className="bg-white text-green-800 px-5 py-2.5 rounded-xl font-bold hover:bg-green-50 transition shadow-md text-sm whitespace-nowrap"
              >
                Ver mi código →
              </a>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {esTutor ? '🐾 Mis Mascotas' : '📋 Pacientes Registrados'}
        </h2>

        {loading ? (
          <LoadingSpinner mensaje="Cargando expedientes..." />
        ) : error ? (
          <ErrorMessage mensaje={error} onRetry={cargarMascotas} />
        ) : mascotas.length === 0 ? (
          <div className="text-center py-20 opacity-50 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-6xl mb-4 animate-bounce">🐾</p>
            <p className="text-gray-600 text-lg font-medium">
              {esTutor
                ? 'Aún no tienes mascotas asignadas. Pídele al veterinario que use tu código de tutor.'
                : 'No hay mascotas registradas en el sistema.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {mascotas.map((animal) => (
              <MascotaCard key={animal.id_animal} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}