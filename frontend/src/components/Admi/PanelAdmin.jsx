import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService'; 
import api from '../../services/api'; 
import { ROLES } from '../../utils/constants';

export default function PanelAdmin() {
  const { usuario } = useAuth();
  
  // 🗄️ Estado para la lista de veterinarios
  const [veterinarios, setVeterinarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  // 📝 Estado para el formulario de nuevo registro
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // 🔄 Cargar la lista al entrar a la pantalla
  useEffect(() => {
    cargarVeterinarios();
  }, []);

  const cargarVeterinarios = async () => {
    try {
      const response = await api.get('/usuarios/veterinarios');
      setVeterinarios(response.data);
    } catch (error) {
      console.error("Error al cargar veterinarios:", error);
    } finally {
      setCargandoLista(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      await authService.register(
        formData.nombre,
        formData.email,
        formData.password,
        ROLES.VETERINARIO
      );
      
      setMensaje({ tipo: 'exito', texto: '¡Veterinario registrado con éxito!' });
      setFormData({ nombre: '', email: '', password: '' }); 
      cargarVeterinarios(); 
      
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.mensaje || "Error al registrar veterinario" 
      });
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Función para eliminar/dar de baja
  const handleDesactivar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas dar de baja a ${nombre}? Perderá su acceso al sistema inmediatamente.`);
    
    if (confirmar) {
      try {
        await api.delete(`/usuarios/veterinarios/${id}`);
        setMensaje({ tipo: 'exito', texto: `El acceso de ${nombre} ha sido revocado.` });
        cargarVeterinarios(); // Recargamos la tabla para que desaparezca
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Hubo un error al intentar dar de baja al usuario.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      <div className="max-w-7xl mx-auto mb-8">
        {/* 🔙 Botón para regresar al inicio */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold mb-6 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit hover:shadow-md"
        >
          <span>←</span> Volver al Inicio
        </Link>

        <h1 className="text-3xl font-bold text-teal-900 flex items-center gap-3">
          <span>🛡️</span> Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">Centro de control del personal médico y volumen de pacientes.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📝 COLUMNA IZQUIERDA: Formulario */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Registrar Nuevo Médico</h2>
          
          {mensaje.texto && (
            <div className={`p-3 rounded mb-6 text-sm text-center font-bold ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleRegistrar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej. Dra. Ana López"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ana@korium.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 text-white font-bold rounded-lg bg-teal-700 hover:bg-teal-800 transition disabled:opacity-50 shadow-md"
            >
              {loading ? 'Registrando...' : 'Dar de Alta al Sistema'}
            </button>
          </form>
        </div>

        {/* 🗄️ COLUMNA DERECHA: Tabla de Personal y Métricas */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">Personal Médico Activo</h2>
          </div>

          {/* 📊 BARRA DE ESTADÍSTICAS RÁPIDAS */}
          {!cargandoLista && veterinarios.length > 0 && (
            <div className="bg-teal-50/50 p-4 border-b border-gray-100 flex justify-around items-center text-sm">
              <div className="text-center">
                <span className="block text-teal-600 uppercase font-bold text-xs tracking-wider">Total Doctores</span>
                <span className="text-2xl font-black text-teal-900">{veterinarios.length}</span>
              </div>
              <div className="text-center border-l-2 border-teal-100 pl-8">
                <span className="block text-green-600 uppercase font-bold text-xs tracking-wider">Pacientes Atendidos Globales</span>
                <span className="text-2xl font-black text-green-700">
                  {veterinarios.reduce((sum, vet) => sum + (parseInt(vet.total_pacientes) || 0), 0)}
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {cargandoLista ? (
              <div className="p-10 text-center text-gray-500 font-bold animate-pulse">Obteniendo métricas de la base de datos...</div>
            ) : veterinarios.length === 0 ? (
              <div className="p-10 text-center text-gray-500 font-medium">No hay veterinarios registrados aún.</div>
            ) : (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Correo</th>
                    <th className="px-6 py-4 text-center">Pacientes</th> {/* 👈 NUEVA COLUMNA */}
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {veterinarios.map((vet) => (
                    <tr key={vet.id_usuario} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                          {vet.nombre.charAt(0).toUpperCase()}
                        </div>
                        {vet.nombre}
                        {vet.id_usuario === usuario?.id && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-2">Tú</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{vet.email}</td>
                      
                      {/* 👈 CELDA DE PACIENTES ATENDIDOS */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-black border border-green-200">
                          {vet.total_pacientes || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-teal-600 font-bold">● Activo</span>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        {vet.id_usuario !== usuario?.id ? (
                          <button 
                            onClick={() => handleDesactivar(vet.id_usuario, vet.nombre)}
                            className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border border-red-200 shadow-sm"
                            title="Revocar acceso"
                          >
                            Dar de Baja
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Protegido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}