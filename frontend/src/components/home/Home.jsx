import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCitas } from '../../hooks/useCitas';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../../services/api';
import FondoPetovix from '../common/FondoPetovix';

// ─────────────────────────────────────────────
// MODAL NUEVA CITA
// ─────────────────────────────────────────────
function ModalNuevaCita({ onCerrar, onGuardar }) {
  const [loading, setLoading] = useState(false);
  const [animales, setAnimales] = useState([]);
  const [errorFecha, setErrorFecha] = useState('');

  const hoyISO = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    id_animal: '',
    fecha: hoyISO,
    hora: '09:00',
    motivo: '',
    notas: ''
  });

  useEffect(() => {
    api.get('/animales')
      .then(({ data }) => setAnimales(data))
      .catch(() => setAnimales([]));
  }, []);

  const handleFecha = (e) => {
    const seleccionada = e.target.value;
    setErrorFecha(seleccionada < hoyISO ? 'No puedes agendar citas en fechas pasadas.' : '');
    setForm({ ...form, fecha: seleccionada });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.fecha < hoyISO) {
      setErrorFecha('No puedes agendar citas en fechas pasadas.');
      return;
    }
    setLoading(true);
    try {
      await onGuardar(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden aparecer">

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">📅 Nueva Cita</h3>
          <button onClick={onCerrar} className="text-2xl leading-none hover:text-teal-100 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">Paciente</label>
            <select
              required
              value={form.id_animal}
              onChange={(e) => setForm({ ...form, id_animal: e.target.value })}
              className="input-petovix"
            >
              <option value="">Selecciona un paciente...</option>
              {animales.map((a) => (
                <option key={a.id_animal} value={a.id_animal}>
                  {a.nombre} — {a.especie}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-1">Fecha</label>
              <input type="date" required value={form.fecha}
                min={hoyISO}
                onChange={handleFecha}
                className={`input-petovix ${errorFecha ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              />
              {errorFecha && <p className="text-xs text-red-500 mt-1">{errorFecha}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-teal-900 mb-1">Hora</label>
              <input type="time" required value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                className="input-petovix"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">Motivo</label>
            <input type="text" required placeholder="Ej: Vacuna anual, revisión general..."
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              className="input-petovix"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-teal-900 mb-1">Notas (opcional)</label>
            <textarea rows="2" placeholder="Observaciones previas..."
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="input-petovix resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCerrar}
              className="boton-petovix-secundario flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="boton-petovix flex-1">
              {loading ? 'Guardando...' : '✅ Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PANEL VETERINARIO
// ─────────────────────────────────────────────
function HomeVeterinario({ usuario }) {
  const [lottiePatitas, setLottiePatitas] = useState(null);
  const [lottieMas, setLottieMas] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const { citasHoy, loading: loadingCitas, crearCita, cancelarCita, completarCita } = useCitas();

  // Verificar si hay cita en los próximos 30 minutos
  useEffect(() => {
    if (!citasHoy.length) return;
    const verificar = () => {
      const ahora = new Date();
      const proxima = citasHoy.find(c => {
        if (c.estado !== 'Pendiente') return false;
        const [h, m] = c.hora.split(':').map(Number);
        const horaCita = new Date();
        horaCita.setHours(h, m, 0, 0);
        const diffMin = (horaCita - ahora) / 60000;
        return diffMin >= 0 && diffMin <= 30;
      });
      setNotificacion(proxima || null);
    };
    verificar();
    const intervaloNotif = setInterval(verificar, 60000); // revisa cada minuto
    return () => clearInterval(intervaloNotif);
  }, [citasHoy]);

  const imagenesCarrusel = [
    "https://images.unsplash.com/photo-1599443015574-be5efa37dd1f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop"
  ];
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual((prev) => (prev === imagenesCarrusel.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagenesCarrusel.length]);

  const handleGuardarCita = async (datos) => {
    await crearCita(datos);
    setMostrarModal(false);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">

      {/* ENCABEZADO */}
      <div className="mb-10 aparecer">
        <span className="badge-petovix mb-3">🩺 Panel clínico</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-teal-900 mt-2">
          Hola veterinari@, <span className="titulo-degradado">{usuario?.nombre || 'Bienvenido'}</span>
        </h2>
        <p className="text-teal-800/60 mt-1">Panel de control clínico — PETOVIX</p>
      </div>

      {/* NOTIFICACIÓN CITA PRÓXIMA */}
      {notificacion && (
        <div className="mb-6 bg-amber-50/90 backdrop-blur border border-amber-300 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm animate-pulse">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-bold text-amber-800 text-sm">
              Cita en menos de 30 minutos
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              <strong>{notificacion.Animal?.nombre}</strong> — {notificacion.motivo} a las <strong>{notificacion.hora?.slice(0,5)}</strong>
            </p>
          </div>
          <button onClick={() => setNotificacion(null)} className="text-amber-400 hover:text-amber-600 text-lg">✕</button>
        </div>
      )}

      {/* TARJETAS DE ACCIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* TARJETA: PACIENTES */}
            <Link to="/dashboard"
              className="tarjeta-petovix tarjeta-petovix-hover aparecer p-6 flex items-center gap-5 group"
              onMouseEnter={() => lottiePatitas?.play()}
              onMouseLeave={() => lottiePatitas?.stop()}
            >
              <div className="bg-teal-50 p-2 rounded-2xl group-hover:bg-teal-100 transition-colors w-20 h-20 flex items-center justify-center overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/6fae18fd-618f-4f23-a9b2-0f41fa9057df/COP9BPwka3.lottie"
                  loop autoplay={false}
                  dotLottieRefCallback={(instance) => setLottiePatitas(instance)}
                  renderConfig={{ devicePixelRatio: window.devicePixelRatio }}
                />
              </div>
              <div>
                <h3 className="font-bold text-teal-900">Pacientes</h3>
                <p className="text-xs text-teal-800/60">Gestión de historiales</p>
              </div>
            </Link>

            {/* TARJETA: NUEVO INGRESO */}
            <Link to="/nueva-mascota"
              className="aparecer p-6 rounded-3xl shadow-lg shadow-emerald-900/20 bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-5 text-white group"
              onMouseEnter={() => lottieMas?.play()}
              onMouseLeave={() => lottieMas?.stop()}
            >
              <div className="bg-white/20 p-2 rounded-2xl group-hover:bg-white/30 transition-colors w-20 h-20 flex items-center justify-center overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/6c3a8090-fc59-4b26-ab90-78830517ded6/oXynHDLWes.lottie"
                  loop autoplay={false}
                  dotLottieRefCallback={(instance) => setLottieMas(instance)}
                  renderConfig={{ devicePixelRatio: window.devicePixelRatio }}
                />
              </div>
              <div>
                <h3 className="font-bold">Nuevo Ingreso</h3>
                <p className="text-xs text-emerald-100">Registro inmediato</p>
              </div>
            </Link>
          </div>

          {/* CARRUSEL */}
          <div className="rounded-3xl overflow-hidden shadow-xl shadow-teal-900/10 relative h-[250px] bg-gray-900 aparecer">
            {imagenesCarrusel.map((img, index) => (
              <img key={index} src={img} alt="Clínica"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === imagenActual ? 'opacity-40' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <h3 className="text-white text-2xl font-bold italic">PETOVIX Tech</h3>
              <p className="text-emerald-300">Monitoreo médico avanzado 24/7</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: AGENDA REAL */}
        <div className="tarjeta-petovix aparecer flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 border-b border-teal-100 flex justify-between items-center">
            <h3 className="font-bold text-teal-900 flex items-center gap-2">
              Agenda del Día
            </h3>
            <button
              onClick={() => setMostrarModal(true)}
              className="text-xs font-bold text-white px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm hover:scale-105 transition-transform"
            >
              + Nueva
            </button>
          </div>

          <div className="p-5 space-y-3 flex-grow overflow-y-auto max-h-[350px]">
            {loadingCitas ? (
              <div className="text-center py-8">
                <p className="text-2xl animate-bounce">🐾</p>
                <p className="text-xs text-teal-800/50 mt-2">Cargando citas...</p>
              </div>
            ) : citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-xs text-teal-800/50 italic">No hay citas para hoy</p>
                <button
                  onClick={() => setMostrarModal(true)}
                  className="mt-4 text-xs text-teal-700 font-bold underline hover:text-teal-900"
                >
                  Agendar una cita
                </button>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <div key={cita.id_cita}
                  className={`flex items-start gap-3 p-3 hover:bg-teal-50/60 rounded-xl transition-colors border-l-4 ${
                    cita.estado === 'Completada' ? 'border-emerald-400 opacity-60' :
                    cita.estado === 'Cancelada'  ? 'border-red-300 opacity-40' :
                                                   'border-teal-400'
                  }`}
                >
                  <div className="text-center min-w-[45px]">
                    <p className="text-sm font-bold text-teal-900">
                      {cita.hora?.slice(0, 5)}
                    </p>
                    <p className="text-[10px] text-teal-800/50 uppercase">
                      {parseInt(cita.hora) >= 12 ? 'PM' : 'AM'}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-teal-900 truncate">
                      {cita.Animal?.nombre}
                      <span className="font-normal text-teal-800/60"> ({cita.Animal?.raza || cita.Animal?.especie})</span>
                    </p>
                    <p className="text-xs text-teal-800/60 truncate">{cita.motivo}</p>
                  </div>
                  {cita.estado === 'Pendiente' && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => completarCita(cita.id_cita)}
                        className="text-teal-200 hover:text-emerald-500 transition text-sm"
                        title="Marcar como completada"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => cancelarCita(cita.id_cita)}
                        className="text-teal-200 hover:text-red-400 transition text-sm"
                        title="Cancelar cita"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {cita.estado !== 'Pendiente' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      cita.estado === 'Completada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'
                    }`}>
                      {cita.estado}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <Link
            to="/calendario"
            className="boton-petovix-secundario m-5 text-sm text-center block"
          >
            Ver Calendario Completo →
          </Link>
        </div>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <ModalNuevaCita
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleGuardarCita}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────
// PANEL TUTOR
// ─────────────────────────────────────────────
function HomeTutor() {
  const { usuario, isAuthenticated } = useAuth();
  const { citasHoy, loading: loadingCitas } = useCitas();
  // citasHoy solo tiene datos si isAuthenticated (useCitas ya lo verifica internamente)

  const imagenesCarrusel = [
    "https://images.unsplash.com/photo-1599443015574-be5efa37dd1f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop"
  ];
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual((prev) => (prev === imagenesCarrusel.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  // Citas próximas: pendientes ordenadas por fecha
  const citasProximas = citasHoy
    .filter(c => c.estado === 'Pendiente')
    .slice(0, 5);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">

      {/* ENCABEZADO */}
      <div className="mb-8 aparecer">
        <span className="badge-petovix mb-3">🐾 Portal de mascotas</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-teal-900 mt-2">
          {isAuthenticated
            ? <>Hola, <span className="titulo-degradado">{usuario?.nombre?.split(' ')[0] || 'Bienvenido'}</span></>
            : <>Bienvenido a <span className="titulo-degradado">PETOVIX</span></>}
        </h2>
        <p className="text-teal-800/60 mt-1">
          {isAuthenticated ? 'Tu portal de mascotas en PETOVIX' : 'Cuidando a tus mejores amigos con tecnología veterinaria.'}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isAuthenticated ? 'lg:grid-cols-3' : ''} gap-8`}>

        {/* COLUMNA IZQUIERDA */}
        <div className={`${isAuthenticated ? 'lg:col-span-2' : 'max-w-2xl mx-auto w-full'} space-y-8`}>

          {/* ACCESO RÁPIDO — solo si está logueado */}
          {isAuthenticated && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard"
              className="tarjeta-petovix tarjeta-petovix-hover aparecer p-6 flex items-center gap-5 group"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🐾
              </div>
              <div>
                <h3 className="font-bold text-teal-900">Mis Mascotas</h3>
                <p className="text-xs text-teal-800/60">Ver expedientes</p>
              </div>
            </Link>

            <Link to="/perfil"
              className="tarjeta-petovix tarjeta-petovix-hover aparecer p-6 flex items-center gap-5 group"
            >
              <div className="bg-teal-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👤
              </div>
              <div>
                <h3 className="font-bold text-teal-900">Mi Perfil</h3>
                <p className="text-xs text-teal-800/60">Datos de cuenta</p>
              </div>
            </Link>
          </div>
          )} {/* fin isAuthenticated acceso rápido */}

          {/* CARRUSEL */}
          <div className="rounded-3xl overflow-hidden shadow-xl shadow-teal-900/10 relative h-[280px] bg-gray-900 aparecer">
            {imagenesCarrusel.map((img, index) => (
              <img key={index} src={img} alt="Clínica Veterinaria"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === imagenActual ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-white text-xl font-bold">Instalaciones de primer nivel</h3>
                <p className="text-emerald-300 text-sm">para tus mascotas 🐶🐱</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: MIS CITAS — solo si está logueado */}
        {isAuthenticated && (
        <div className="tarjeta-petovix aparecer flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 border-b border-teal-100">
            <h3 className="font-bold text-teal-900 flex items-center gap-2">
              📅 Mis Próximas Citas
            </h3>
            <p className="text-xs text-teal-800/50 mt-0.5">Solo lectura — el veterinario las agenda</p>
          </div>

          <div className="p-5 space-y-3 flex-grow overflow-y-auto max-h-[380px]">
            {loadingCitas ? (
              <div className="text-center py-8">
                <p className="text-2xl animate-bounce">🐾</p>
                <p className="text-xs text-teal-800/50 mt-2">Cargando citas...</p>
              </div>
            ) : citasProximas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-bold text-teal-900">Sin citas próximas</p>
                <p className="text-xs text-teal-800/50 mt-1">
                  Cuando el veterinario agende una cita para tu mascota, aparecerá aquí.
                </p>
              </div>
            ) : (
              citasProximas.map((cita) => (
                <div key={cita.id_cita}
                  className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100"
                >
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg px-2 py-1 text-center min-w-[50px] shadow-sm">
                    <p className="text-xs font-bold">{cita.hora?.slice(0, 5)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-teal-900 truncate">
                      {cita.Animal?.nombre}
                      <span className="font-normal text-teal-800/60 text-xs"> · {cita.Animal?.especie}</span>
                    </p>
                    <p className="text-xs text-teal-800/60 truncate">{cita.motivo}</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">
                      {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
                        weekday: 'short', day: 'numeric', month: 'short'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                    cita.estado === 'Completada' ? 'bg-emerald-100 text-emerald-700' :
                    cita.estado === 'Cancelada'  ? 'bg-red-100 text-red-600' :
                                                    'bg-teal-100 text-teal-700'
                  }`}>
                    {cita.estado}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-teal-50">
            <p className="text-xs text-center text-teal-800/50">
              Para agendar una cita, contacta a tu veterinario.
            </p>
          </div>
        </div>
        )} {/* fin isAuthenticated citas */}
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function Home() {
  const { esVeterinario, esAdministrador, usuario } = useAuth();
  return (
    <FondoPetovix>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {(esVeterinario || esAdministrador) ? <HomeVeterinario usuario={usuario} /> : <HomeTutor />}
        <Footer />
      </div>
    </FondoPetovix>
  );
}