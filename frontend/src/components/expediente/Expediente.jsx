import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useExpediente } from '../../hooks/useExpediente';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import HeaderExpediente from './HeaderExpediente';
import InfoBasica from './InfoBasica';
import InfoTutor from './InfoTutor';
import HistorialMedico from './HistorialMedico';
import ModalEvento from './ModalEvento';
import ModalTutor from './ModalTutor';

export default function Expediente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { esVeterinario, esAdministrador } = useAuth();
  const puedeEditar = esVeterinario || esAdministrador;
  
  // Hook personalizado con toda la lógica del expediente
  const { 
    animal, 
    loading, 
    error,
    actualizarAnimal,
    agregarEvento, 
    agregarTutor, 
    cambiarFoto,
    actualizarTutor
  } = useExpediente(id);

  // Estados para modales
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false);
  const [mostrarModalTutor, setMostrarModalTutor] = useState(false);

  // 💉 Guardar evento médico
  const handleGuardarEvento = async (eventoData, archivo) => {
    await agregarEvento(eventoData, archivo);
    alert('✅ Evento agregado exitosamente');
  };

  // 👤 Guardar tutor
  const handleGuardarTutor = async (tutorData) => {
    await agregarTutor(tutorData);
    alert('✅ Tutor registrado exitosamente');
  };

  // 📸 Cambiar foto
  const handleCambiarFoto = async (file) => {
    await cambiarFoto(file);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner mensaje="Cargando expediente..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Botón volver (en caso de error) 🌟 */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          {puedeEditar ? 'Volver al buscador' : 'Volver a mis mascotas'}
        </button>
        <ErrorMessage mensaje={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <ErrorMessage mensaje="No se encontró el expediente" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      
      {/* Botón volver principal 🌟 */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
        {puedeEditar ? 'Volver al buscador' : 'Volver a mis mascotas'}
      </button>

      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header con foto y nombre */}
        <HeaderExpediente 
          animal={animal}
          esVeterinario={puedeEditar}
          onCambiarFoto={handleCambiarFoto}
        />

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
            <InfoBasica animal={animal}
            esVeterinario={puedeEditar} 
            onActualizar={actualizarAnimal} 
            />
            
            <InfoTutor 
              animal={animal}
              esVeterinario={puedeEditar}
              onActualizarTutor={actualizarTutor}
              onAgregarTutor={() => setMostrarModalTutor(true)}
            />
          </div>

          <div>
            <HistorialMedico 
              historial={animal.HistorialMedicos}
              esVeterinario={puedeEditar}
              onAgregarEvento={() => setMostrarModalEvento(true)}
            />
          </div>
        </div>
      </div>

      {puedeEditar && mostrarModalEvento && (
        <ModalEvento 
          onCerrar={() => setMostrarModalEvento(false)}
          onGuardar={handleGuardarEvento}
        />
      )}

      {puedeEditar && mostrarModalTutor && (
        <ModalTutor 
          onCerrar={() => setMostrarModalTutor(false)}
          onGuardar={handleGuardarTutor}
        />
      )}
    </div>
  );

  
}