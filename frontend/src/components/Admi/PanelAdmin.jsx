import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import api from '../../services/api';
import { ROLES } from '../../utils/constants';
import FondoPetovix from '../common/FondoPetovix';

export default function PanelAdmin() {
  const { usuario } = useAuth();

  // 🗄️ Estado para la lista de veterinarios
  const [veterinarios, setVeterinarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  // 📝 Estado para el formulario de nuevo registro
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '',
    especialidad: '', bio: '', anios_experiencia: ''
  });
  const [fotoFile, setFotoFile] = useState(null);

  // ✏️ Estado del modal de edición
  const [vetEditando, setVetEditando] = useState(null); // null = modal cerrado
  const [editData, setEditData] = useState({ nombre: '', especialidad: '', bio: '', anios_experiencia: '' });
  const [editFoto, setEditFoto] = useState(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
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
      const respuesta = await authService.register(
        formData.nombre,
        formData.email,
        formData.password,
        ROLES.VETERINARIO,
        {
          especialidad: formData.especialidad || null,
          bio: formData.bio || null,
          anios_experiencia: formData.anios_experiencia ? parseInt(formData.anios_experiencia) : null
        }
      );

      // 📸 Si el admin seleccionó una foto, la subimos al usuario recién creado
      if (fotoFile && respuesta.id_usuario) {
        const fd = new FormData();
        fd.append('imagen', fotoFile);
        await api.post(`/upload/foto-perfil/${respuesta.id_usuario}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setMensaje({ tipo: 'exito', texto: '¡Veterinario registrado con éxito!' });
      setFormData({ nombre: '', email: '', password: '', especialidad: '', bio: '', anios_experiencia: '' });
      setFotoFile(null);
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

  // ✏️ Abrir modal con los datos actuales precargados
  const abrirEdicion = (vet) => {
    setVetEditando(vet);
    setEditData({
      nombre: vet.nombre || '',
      especialidad: vet.especialidad || '',
      bio: vet.bio || '',
      anios_experiencia: vet.anios_experiencia ?? ''
    });
    setEditFoto(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    setGuardandoEdicion(true);
    try {
      await api.put(`/usuarios/veterinarios/${vetEditando.id_usuario}`, editData);

      // 📸 Si seleccionó foto nueva, la subimos
      if (editFoto) {
        const fd = new FormData();
        fd.append('imagen', editFoto);
        await api.post(`/upload/foto-perfil/${vetEditando.id_usuario}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setMensaje({ tipo: 'exito', texto: `Datos de ${editData.nombre} actualizados ✅` });
      setVetEditando(null);
      cargarVeterinarios();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.mensaje || 'Error al actualizar los datos'
      });
    } finally {
      setGuardandoEdicion(false);
    }
  };

  return (
    <FondoPetovix>
      <div className="p-6 md:p-10 font-sans">

      <div className="max-w-7xl mx-auto mb-8 aparecer">
        {/* 🔙 Botón para regresar al inicio */}
        <Link
          to="/"
          className="boton-petovix-secundario inline-flex items-center gap-2 !py-2 !px-4 text-sm mb-6 w-fit group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver al Inicio
        </Link>

        <span className="badge-petovix block w-fit">🛡️ Solo administradores</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mt-2">
          Panel de <span className="titulo-degradado">Administración</span>
        </h1>
        <p className="text-teal-800/60 mt-2">Centro de control del personal médico y volumen de pacientes.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 📝 COLUMNA IZQUIERDA: Formulario */}
        <div className="lg:col-span-1 tarjeta-petovix aparecer p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-teal-900 mb-6 border-b border-teal-100 pb-2">Registrar Nuevo Médico</h2>

          {mensaje.texto && (
            <div className={`p-3 rounded-xl mb-6 text-sm text-center font-bold aparecer ${mensaje.tipo === 'exito' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleRegistrar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej. Dra. Ana López"
                className="input-petovix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ana@korium.com"
                className="input-petovix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-900 mb-1">Contraseña Temporal</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
                className="input-petovix"
              />
            </div>

            {/* 🌟 DATOS DEL DIRECTORIO PÚBLICO */}
            <div className="pt-2 border-t border-teal-100">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
                Perfil público (Nuestro Equipo)
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-1">Especialidad</label>
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    placeholder="Ej. Cirugía General, Especialista en Felinos"
                    className="input-petovix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-1">Años de experiencia</label>
                  <input
                    type="number"
                    name="anios_experiencia"
                    value={formData.anios_experiencia}
                    onChange={handleChange}
                    min="0"
                    max="60"
                    placeholder="Ej. 5"
                    className="input-petovix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-1">Biografía breve</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    maxLength="300"
                    placeholder="Ej. Apasionado por el bienestar animal, con enfoque en medicina preventiva..."
                    className="input-petovix resize-none"
                  />
                  <p className="text-xs text-teal-800/40 text-right">{formData.bio.length}/300</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-900 mb-1">Fotografía profesional</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setFotoFile(e.target.files[0] || null)}
                    className="w-full text-sm text-teal-800/70 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 transition cursor-pointer"
                  />
                  {fotoFile && (
                    <p className="text-xs text-emerald-600 mt-1">✓ {fotoFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="boton-petovix w-full mt-4"
            >
              {loading ? 'Registrando...' : 'Dar de Alta al Sistema'}
            </button>
          </form>
        </div>

        {/* 🗄️ COLUMNA DERECHA: Tabla de Personal y Métricas */}
        <div className="lg:col-span-2 tarjeta-petovix aparecer overflow-hidden" style={{ animationDelay: '120ms' }}>

          <div className="p-6 border-b border-teal-100 flex justify-between items-center bg-gradient-to-r from-teal-50 to-emerald-50">
            <h2 className="text-xl font-bold text-teal-900">Personal Médico Activo</h2>
          </div>

          {/* 📊 BARRA DE ESTADÍSTICAS RÁPIDAS */}
          {!cargandoLista && veterinarios.length > 0 && (
            <div className="bg-teal-50/40 p-4 border-b border-teal-100 flex justify-around items-center text-sm">
              <div className="text-center">
                <span className="block text-teal-600 uppercase font-bold text-xs tracking-wider">Total Doctores</span>
                <span className="text-2xl font-black text-teal-900">{veterinarios.length}</span>
              </div>
              <div className="text-center border-l-2 border-teal-100 pl-8">
                <span className="block text-emerald-600 uppercase font-bold text-xs tracking-wider">Pacientes Atendidos Globales</span>
                <span className="text-2xl font-black titulo-degradado">
                  {veterinarios.reduce((sum, vet) => sum + (parseInt(vet.total_pacientes) || 0), 0)}
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {cargandoLista ? (
              <div className="p-10 text-center text-teal-800/60 font-bold animate-pulse">Obteniendo métricas de la base de datos...</div>
            ) : veterinarios.length === 0 ? (
              <div className="p-10 text-center text-teal-800/60 font-medium">No hay veterinarios registrados aún.</div>
            ) : (
              <table className="w-full text-left text-sm text-teal-800/80">
                <thead className="bg-teal-50/60 text-teal-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Correo</th>
                    <th className="px-6 py-4 text-center">Pacientes</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50">
                  {veterinarios.map((vet) => (
                    <tr key={vet.id_usuario} className="hover:bg-teal-50/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-teal-900 flex items-center gap-3">
                        {vet.foto_perfil ? (
                          <img
                            src={vet.foto_perfil}
                            alt={vet.nombre}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                            {vet.nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {vet.nombre}
                        {vet.id_usuario === usuario?.id && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full ml-2">Tú</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{vet.email}</td>

                      {/* CELDA DE PACIENTES ATENDIDOS */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-black border border-emerald-200">
                          {vet.total_pacientes || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-emerald-600 font-bold">● Activo</span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => abrirEdicion(vet)}
                          className="text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-teal-200 shadow-sm"
                          title="Editar perfil público"
                        >
                          Editar
                        </button>
                        {vet.id_usuario !== usuario?.id ? (
                          <button
                            onClick={() => handleDesactivar(vet.id_usuario, vet.nombre)}
                            className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-red-200 shadow-sm"
                            title="Revocar acceso"
                          >
                            Dar de Baja
                          </button>
                        ) : (
                          <span className="text-teal-800/40 text-xs italic">Protegido</span>
                        )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* ✏️ MODAL DE EDICIÓN */}
      {vetEditando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => !guardandoEdicion && setVetEditando(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto aparecer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 flex justify-between items-center sticky top-0 rounded-t-3xl z-10">
              <h3 className="text-xl font-bold text-white">
                ✏️ Editar a {vetEditando.nombre}
              </h3>
              <button
                onClick={() => setVetEditando(null)}
                disabled={guardandoEdicion}
                className="text-white hover:text-teal-100 text-2xl leading-none font-bold transition-colors"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={editData.nombre}
                  onChange={handleEditChange}
                  required
                  className="input-petovix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={editData.especialidad}
                  onChange={handleEditChange}
                  placeholder="Ej. Cirugía General, Especialista en Felinos"
                  className="input-petovix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Años de experiencia</label>
                <input
                  type="number"
                  name="anios_experiencia"
                  value={editData.anios_experiencia}
                  onChange={handleEditChange}
                  min="0"
                  max="60"
                  placeholder="Ej. 5"
                  className="input-petovix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">Biografía breve</label>
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleEditChange}
                  rows="3"
                  maxLength="300"
                  placeholder="Ej. Apasionado por el bienestar animal..."
                  className="input-petovix resize-none"
                />
                <p className="text-xs text-teal-800/40 text-right">{editData.bio.length}/300</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-900 mb-1">
                  Fotografía profesional {vetEditando.foto_perfil && <span className="text-xs text-teal-800/50">(ya tiene una — sube otra para reemplazarla)</span>}
                </label>
                <div className="flex items-center gap-3">
                  {vetEditando.foto_perfil && !editFoto && (
                    <img
                      src={vetEditando.foto_perfil}
                      alt="Foto actual"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setEditFoto(e.target.files[0] || null)}
                    className="w-full text-sm text-teal-800/70 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 transition cursor-pointer"
                  />
                </div>
                {editFoto && (
                  <p className="text-xs text-emerald-600 mt-1">✓ Nueva foto: {editFoto.name}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setVetEditando(null)}
                  disabled={guardandoEdicion}
                  className="boton-petovix-secundario flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoEdicion}
                  className="boton-petovix flex-1"
                >
                  {guardandoEdicion ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </FondoPetovix>
  );
}