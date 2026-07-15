import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../common/Navbar';
import { authService } from '../../services/authService';
import api from '../../services/api';
import FondoPetovix from '../common/FondoPetovix';

export default function Perfil() {
  const { usuario, logout, actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

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
      actualizarUsuario({ nombre: formData.nombre, email: formData.email });
      alert('¡Tus datos se han actualizado correctamente! ✅');
      setEditando(false);
      setFormData(prev => ({ ...prev, passwordActual: '', nuevaPassword: '' }));
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handleFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar 2MB');
      return;
    }
    setSubiendoFoto(true);
    try {
      const formDataFoto = new FormData();
      formDataFoto.append('imagen', archivo);

      const { data } = await api.post('/upload/foto-perfil', formDataFoto, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ✅ Actualiza estado + localStorage en un solo lugar
      actualizarUsuario({ foto_perfil: data.url });
    } catch {
      alert('Error al subir la foto. Intenta de nuevo.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  // ✅ Lee directo del usuario (que ya persiste en localStorage)
  const fotoPerfil = usuario?.foto_perfil || null;
  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : '👤';

  return (
    <FondoPetovix>
      <Navbar />

      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="boton-petovix-secundario aparecer mb-6 !py-2 !px-4 text-sm flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Volver
        </button>

        <div className="tarjeta-petovix aparecer overflow-hidden flex flex-col md:flex-row">

          {/* COLUMNA IZQUIERDA */}
          <div className="relative bg-gradient-to-b from-emerald-500 to-teal-700 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center overflow-hidden">

            {/* Manchas decorativas */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-14 -right-10 w-48 h-48 bg-teal-300/20 rounded-full blur-3xl" />
            </div>

            <label className="relative cursor-pointer group mb-6 z-10">
              <div className="w-32 h-32 bg-white text-teal-700 rounded-full flex items-center justify-center text-5xl font-bold shadow-xl ring-4 ring-white/60 overflow-hidden">
                {fotoPerfil
                  ? <img src={fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
                  : inicial
                }
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {subiendoFoto
                  ? <span className="text-white text-xs font-bold animate-pulse">Subiendo...</span>
                  : <span className="text-white text-xs font-bold">📷 Cambiar</span>
                }
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFoto} disabled={subiendoFoto} />
            </label>

            <h2 className="text-2xl font-bold mb-1 z-10">{usuario?.nombre}</h2>

            {usuario?.rol === 'Tutor' && (
              <div className="bg-white/15 backdrop-blur p-3 rounded-2xl w-full my-3 border border-white/30 z-10">
                <p className="text-xs text-emerald-100 font-semibold mb-1 uppercase tracking-wider">Mi Código de Tutor</p>
                <p className="font-mono text-xl text-white tracking-widest font-bold">
                  {usuario?.codigo_tutor || 'CARGANDO...'}
                </p>
              </div>
            )}

            <span className="bg-white/20 backdrop-blur text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-white/30 mt-2 z-10">
              {usuario?.rol}
            </span>
            <p className="text-emerald-100 text-sm mb-8 opacity-80 z-10">Miembro desde 2026</p>

            <button
              onClick={() => { logout(); window.location.href = '/'; }}
              className="mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-full transition-all w-full shadow-lg hover:scale-[1.02] z-10"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-center mb-6 border-b border-teal-100 pb-4">
              <h3 className="text-2xl font-bold text-teal-900">
                Ajustes de <span className="titulo-degradado">Cuenta</span>
              </h3>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="boton-petovix-secundario !py-2 !px-4 text-sm flex items-center gap-2"
                >
                  ✏️ Editar Datos
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">Información Personal</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-teal-900 mb-1">Nombre Completo</label>
                    <input
                      type="text" name="nombre" value={formData.nombre}
                      onChange={handleChange} disabled={!editando} required
                      className="input-petovix !p-3 disabled:bg-teal-50/40 disabled:text-teal-800/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-teal-900 mb-1">Correo Electrónico</label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} disabled={!editando} required
                      className="input-petovix !p-3 disabled:bg-teal-50/40 disabled:text-teal-800/60"
                    />
                  </div>
                </div>
              </div>

              {editando && (
                <div className="pt-4 border-t border-teal-100 aparecer space-y-4">
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">Seguridad</h4>
                  <div>
                    <label className="block text-sm font-bold text-teal-900 mb-1">Contraseña Actual</label>
                    <input
                      type="password" name="passwordActual" value={formData.passwordActual}
                      onChange={handleChange} required={editando} placeholder="••••••••"
                      className="input-petovix !p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-teal-900 mb-1">Nueva Contraseña (Opcional)</label>
                    <input
                      type="password" name="nuevaPassword" value={formData.nuevaPassword}
                      onChange={handleChange} placeholder="Mínimo 6 caracteres" minLength="6"
                      className="input-petovix !p-3"
                    />
                  </div>
                </div>
              )}

              {editando && (
                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setEditando(false)}
                    className="boton-petovix-secundario flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" disabled={guardando}
                    className="boton-petovix flex-1"
                  >
                    {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </FondoPetovix>
  );
}