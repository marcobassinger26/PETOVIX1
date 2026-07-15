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

  const {
    animal, loading, error,
    actualizarAnimal,
    agregarEvento,
    editarEvento,
    eliminarEvento,
    agregarTutor,
    cambiarFoto,
    actualizarTutor
  } = useExpediente(id);

  const [mostrarModalEvento, setMostrarModalEvento] = useState(false);
  const [eventoEditar, setEventoEditar] = useState(null); // null = modo crear
  const [mostrarModalTutor, setMostrarModalTutor] = useState(false);

  // Abrir modal en modo CREAR
  const abrirModalNuevo = () => {
    setEventoEditar(null);
    setMostrarModalEvento(true);
  };

  // Abrir modal en modo EDITAR
  const abrirModalEditar = (evento) => {
    setEventoEditar(evento);
    setMostrarModalEvento(true);
  };

  // Guardar: distingue crear vs editar
  const handleGuardarEvento = async (eventoData, archivo, firmaArchivo) => {
    if (eventoEditar) {
      await editarEvento(eventoEditar.id_evento, eventoData, archivo);
    } else {
      await agregarEvento(eventoData, archivo);
    }
    // La firma se maneja igual que radiografía — si quisieras un endpoint separado lo agregas aquí
  };

  const handleGuardarTutor = async (tutorData) => {
    await agregarTutor(tutorData);
  };

  const handleCambiarFoto = async (file) => {
    await cambiarFoto(file);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner mensaje="Cargando expediente..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate(-1)}
        className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 transition-all flex items-center gap-2 group w-fit">
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        {puedeEditar ? 'Volver al buscador' : 'Volver a mis mascotas'}
      </button>
      <ErrorMessage mensaje={error} onRetry={() => window.location.reload()} />
    </div>
  );

  if (!animal) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ErrorMessage mensaje="No se encontró el expediente" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">

      <button onClick={() => navigate(-1)}
        className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 transition-all flex items-center gap-2 group w-fit">
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        {puedeEditar ? 'Volver al buscador' : 'Volver a mis mascotas'}
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <HeaderExpediente
          animal={animal}
          esVeterinario={puedeEditar}
          onCambiarFoto={handleCambiarFoto}
        />

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InfoBasica animal={animal} esVeterinario={puedeEditar} onActualizar={actualizarAnimal} />
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
              onAgregarEvento={abrirModalNuevo}
              onEditarEvento={abrirModalEditar}
              onEliminarEvento={eliminarEvento}
            />
          </div>
        </div>
      </div>

      {puedeEditar && mostrarModalEvento && (
        <ModalEvento
          eventoEditar={eventoEditar}
          onCerrar={() => { setMostrarModalEvento(false); setEventoEditar(null); }}
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