import { useAuth } from '../../hooks/useAuth';
import { useMascotas } from '../../hooks/useMascotas';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import BuscadorChip from './BuscadorChip';
import VincularMascota from './VincularMascota';
import MascotaCard from './MascotaCard';

export default function Dashboard() {
  const { usuario, esVeterinario, esTutor } = useAuth();
  const navigate = useNavigate();
  const { 
    mascotas, 
    loading, 
    error,
    cargarMascotas, 
    buscarPorChip, 
    vincularMascota 
  } = useMascotas(esTutor ? usuario?.id_cliente : undefined);

  // 🔍 Manejar búsqueda por chip (solo veterinarios)
  const handleBuscar = async (chip) => {
    try {
      await buscarPorChip(chip);
    } catch (error) {
      alert("No se encontró mascota con ese chip");
    }
  };

  

  // 🔗 Manejar vinculación de mascota (solo tutores)
  const handleVincular = async (chip) => {
    // 🛡️ Validación amigable: Si el token aún no tiene el ID, le pedimos reconectar
    if (!usuario?.id_cliente) {
      alert("Aún no tienes un perfil de cliente asociado. Por favor, cierra sesión y vuelve a entrar para sincronizar tus datos de KORIUM.");
      return; // Detenemos la ejecución de forma limpia
    }

    try {
      // 🚀 Llamamos a la vinculación automática (ya no es necesario forzar el ID aquí si el backend lo lee del token)
      await vincularMascota(chip);
      
      alert("¡Mascota vinculada exitosamente! 🎉");
      
      // 🌟 MAGIA: Recargamos la lista de mascotas silenciosamente para que aparezca la nueva tarjeta de inmediato
      await cargarMascotas(); 

    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al vincular. Verifica que el número de chip sea correcto y no tenga dueño.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="container mx-auto p-4 md:p-8">
        
        {/* 🌟 Botón volver al Inicio 🌟 */}
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Volver al Inicio
        </button>

        {/* Buscador para Veterinarios */}
        {esVeterinario && (
          <BuscadorChip 
            onBuscar={handleBuscar}
            onLimpiar={cargarMascotas}
          />
        )}

        {/* Vinculador para Tutores */}
        {esTutor && (
          <VincularMascota onVincular={handleVincular} />
        )}

        {/* Título de la sección */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {esTutor ? '🐾 Mis Mascotas' : '📋 Pacientes Recientes'}
        </h2>

        {/* Manejo de estados: Loading, Error, Sin datos, Lista */}
        {loading ? (
          <LoadingSpinner mensaje="Cargando expedientes..." />
        ) : error ? (
          <ErrorMessage mensaje={error} onRetry={cargarMascotas} />
        ) : mascotas.length === 0 ? (
          <div className="text-center py-20 opacity-50 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-6xl mb-4 animate-bounce">🐾</p>
            <p className="text-gray-600 text-lg font-medium">
              {esTutor 
                ? 'Aún no tienes mascotas registradas. Ingresa el chip arriba para ver su carnet.' 
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