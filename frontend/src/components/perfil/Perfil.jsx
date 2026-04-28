import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../common/Navbar';
import { authService } from '../../services/authService';

export default function Perfil() {
  const { usuario, logout, actualizarUsuario } = useAuth(); 
  const navigate = useNavigate();
  
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    passwordActual: '',
    nuevaPassword: ''
  });

  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({
        ...prev,
        nombre: usuario.nombre || '',
        email: usuario.email || ''
      }));
    }
  }, [usuario, editando]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    try {
      await authService.updateProfile(formData);
      
      if (actualizarUsuario) {
        actualizarUsuario({
          ...usuario,
          nombre: formData.nombre,
          email: formData.email
        });
      }

      alert('¡Tus datos se han actualizado correctamente! ✅');
      setEditando(false);
      
      setFormData(prev => ({ 
        ...prev, 
        passwordActual: '', 
        nuevaPassword: '' 
      }));

    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : '👤';

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 hover:shadow-md transition-all flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Volver
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* COLUMNA IZQUIERDA: Tarjeta Dinámica */}
          <div className="bg-green-900 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-green-100 text-green-900 rounded-full flex items-center justify-center text-5xl font-bold shadow-inner mb-6 border-4 border-green-700">
              {inicial}
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{usuario?.nombre}</h2>

            {/* 🌟 NUEVO: CAJA DEL CÓDIGO DE TUTOR */}
            {usuario?.rol === 'Tutor' && (
              <div className="bg-green-800 p-3 rounded-xl w-full my-3 border border-green-600 shadow-inner">
                <p className="text-xs text-green-300 font-semibold mb-1 uppercase tracking-wider">Mi Código de Tutor</p>
                <p className="font-mono text-xl text-white tracking-widest font-bold">
                  {usuario?.codigo_tutor || 'CARGANDO...'}
                </p>
              </div>
            )}

            <span className="bg-green-700 text-green-100 px-3 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 shadow-sm mt-2">
              {usuario?.rol}
            </span>
            <p className="text-green-200 text-sm mb-8 opacity-80">Miembro desde 2026</p>
            
            <button 
              onClick={() => {
                logout();
                window.location.href = '/'; 
              }}
              className="mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full border border-red-400 shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* COLUMNA DERECHA: Formulario */}
          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">Ajustes de Cuenta</h3>
              {!editando && (
                <button 
                  onClick={() => setEditando(true)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition text-sm flex items-center gap-2"
                >
                  ✏️ Editar Datos
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-3">Información Personal</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={!editando}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editando}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {editando && (
                <div className="pt-4 border-t border-gray-100 animate-fade-in space-y-4">
                  <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-3">Seguridad</h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña Actual</label>
                    <input 
                      type="password" 
                      name="passwordActual"
                      value={formData.passwordActual}
                      onChange={handleChange}
                      required={editando}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nueva Contraseña (Opcional)</label>
                    <input 
                      type="password" 
                      name="nuevaPassword"
                      value={formData.nuevaPassword}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {editando && (
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button"
                    onClick={() => setEditando(false)}
                    className="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition shadow-lg disabled:opacity-50"
                  >
                    {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}