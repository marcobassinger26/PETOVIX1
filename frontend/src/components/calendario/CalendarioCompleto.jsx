import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import FondoPetovix from '../common/FondoPetovix';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function getDiasDelMes(anio, mes) {
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  return { primerDia, totalDias };
}

function formatearFecha(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

const COLOR_ESTADO = {
  Pendiente:  { bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500',    borde: 'border-teal-400' },
  Completada: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', borde: 'border-emerald-400' },
  Cancelada:  { bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400',     borde: 'border-red-300' },
};

// ─────────────────────────────────────────────
// MODAL DETALLE DE CITA
// ─────────────────────────────────────────────
function ModalDetalleCita({ cita, onCerrar, onCancelar, onCompletar }) {
  if (!cita) return null;
  const color = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden aparecer">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Detalle de Cita</h3>
          <button onClick={onCerrar} className="text-2xl leading-none hover:text-teal-100 transition-colors">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🐾
            </div>
            <div>
              <p className="font-bold text-teal-900 text-lg">{cita.Animal?.nombre}</p>
              <p className="text-xs text-teal-800/60">{cita.Animal?.especie} · {cita.Animal?.raza}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-teal-50/70 rounded-xl p-3">
              <p className="text-xs text-teal-700/60 mb-1">Fecha</p>
              <p className="font-bold text-teal-900">
                {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </p>
            </div>
            <div className="bg-teal-50/70 rounded-xl p-3">
              <p className="text-xs text-teal-700/60 mb-1">Hora</p>
              <p className="font-bold text-teal-900">{cita.hora?.slice(0, 5)}</p>
            </div>
          </div>

          <div className="bg-teal-50/70 rounded-xl p-3 text-sm">
            <p className="text-xs text-teal-700/60 mb-1">Motivo</p>
            <p className="font-bold text-teal-900">{cita.motivo}</p>
          </div>

          {cita.notas && (
            <div className="bg-amber-50 rounded-xl p-3 text-sm border border-amber-100">
              <p className="text-xs text-amber-600 mb-1">📝 Notas</p>
              <p className="text-teal-800/80">{cita.notas}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${color.bg} ${color.text}`}>
              {cita.estado}
            </span>
          </div>

          {cita.estado === 'Pendiente' && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onCancelar(cita.id_cita)}
                className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-full font-bold hover:bg-red-100 transition text-sm"
              >
                Cancelar cita
              </button>
              <button
                onClick={() => onCompletar(cita.id_cita)}
                className="boton-petovix flex-1 !py-2.5 text-sm"
              >
                ✅ Completar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function CalendarioCompleto() {
  const navigate = useNavigate();
  const hoy = new Date();

  const [anio, setAnio]   = useState(hoy.getFullYear());
  const [mes, setMes]     = useState(hoy.getMonth());
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado]   = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Cargar todas las citas del veterinario
  const cargarCitas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/citas');
      setCitas(data);
    } catch {
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

  // Cambiar mes
  const mesAnterior = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
    setDiaSeleccionado(null);
  };
  const mesSiguiente = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
    setDiaSeleccionado(null);
  };

  // Citas filtradas por estado
  const citasFiltradas = filtroEstado === 'Todos'
    ? citas
    : citas.filter(c => c.estado === filtroEstado);

  // Citas agrupadas por fecha
  const citasPorFecha = citasFiltradas.reduce((acc, cita) => {
    const key = cita.fecha;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cita);
    return acc;
  }, {});

  // Citas del día seleccionado o de hoy
  const fechaDiaPanel = diaSeleccionado
    ? formatearFecha(anio, mes, diaSeleccionado)
    : hoy.toISOString().split('T')[0];
  const citasDelDia = (citasPorFecha[fechaDiaPanel] || [])
    .sort((a, b) => a.hora.localeCompare(b.hora));

  // Acciones de cita
  const handleCancelar = async (id) => {
    await api.delete(`/citas/${id}`);
    setCitaSeleccionada(null);
    cargarCitas();
  };
  const handleCompletar = async (id) => {
    await api.put(`/citas/${id}/estado`, { estado: 'Completada' });
    setCitaSeleccionada(null);
    cargarCitas();
  };

  // Estadísticas del mes visible
  const citasDelMes = citas.filter(c => {
    const [a, m2] = c.fecha.split('-').map(Number);
    return a === anio && m2 === mes + 1;
  });
  const pendientesMes  = citasDelMes.filter(c => c.estado === 'Pendiente').length;
  const completadasMes = citasDelMes.filter(c => c.estado === 'Completada').length;
  const canceladasMes  = citasDelMes.filter(c => c.estado === 'Cancelada').length;

  const { primerDia, totalDias } = getDiasDelMes(anio, mes);
  const hoyStr = hoy.toISOString().split('T')[0];

  return (
    <FondoPetovix>
      <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

        {/* ENCABEZADO */}
        <div className="flex items-center gap-4 mb-8 aparecer">
          <button
            onClick={() => navigate(-1)}
            className="boton-petovix-secundario !py-2 !px-4 text-sm flex items-center gap-2 group w-fit"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-teal-900">
              Calendario de <span className="titulo-degradado">Citas</span>
            </h1>
            <p className="text-sm text-teal-800/60">Vista completa de tu agenda clínica</p>
          </div>
        </div>

        {/* ESTADÍSTICAS DEL MES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="tarjeta-petovix aparecer p-4 text-center">
            <p className="text-3xl font-bold text-teal-900">{citasDelMes.length}</p>
            <p className="text-xs text-teal-800/60 mt-1">Total del mes</p>
          </div>
          <div className="tarjeta-petovix aparecer p-4 text-center !bg-teal-50/80" style={{ animationDelay: '60ms' }}>
            <p className="text-3xl font-bold text-teal-700">{pendientesMes}</p>
            <p className="text-xs text-teal-600 mt-1">Pendientes</p>
          </div>
          <div className="tarjeta-petovix aparecer p-4 text-center !bg-emerald-50/80" style={{ animationDelay: '120ms' }}>
            <p className="text-3xl font-bold text-emerald-700">{completadasMes}</p>
            <p className="text-xs text-emerald-600 mt-1">Completadas</p>
          </div>
          <div className="tarjeta-petovix aparecer p-4 text-center !bg-red-50/80" style={{ animationDelay: '180ms' }}>
            <p className="text-3xl font-bold text-red-600">{canceladasMes}</p>
            <p className="text-xs text-red-400 mt-1">Canceladas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA: CALENDARIO */}
          <div className="lg:col-span-2">
            <div className="tarjeta-petovix aparecer overflow-hidden" style={{ animationDelay: '150ms' }}>

              {/* HEADER DEL CALENDARIO */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
                <button onClick={mesAnterior}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
                >‹</button>
                <h2 className="text-xl font-bold">
                  {MESES[mes]} {anio}
                </h2>
                <button onClick={mesSiguiente}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
                >›</button>
              </div>

              {/* FILTRO */}
              <div className="px-6 py-3 border-b border-teal-100 flex gap-2 flex-wrap">
                {['Todos', 'Pendiente', 'Completada', 'Cancelada'].map(estado => (
                  <button key={estado}
                    onClick={() => setFiltroEstado(estado)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${
                      filtroEstado === estado
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {estado}
                  </button>
                ))}
              </div>

              {/* DÍAS DE LA SEMANA */}
              <div className="grid grid-cols-7 border-b border-teal-100">
                {DIAS_SEMANA.map(d => (
                  <div key={d} className="py-3 text-center text-xs font-bold text-teal-700/50 uppercase">
                    {d}
                  </div>
                ))}
              </div>

              {/* CUADRÍCULA DE DÍAS */}
              {loading ? (
                <div className="py-20 text-center">
                  <p className="text-3xl animate-bounce">🐾</p>
                  <p className="text-sm text-teal-800/50 mt-2">Cargando citas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-7">
                  {/* Celdas vacías del inicio */}
                  {Array.from({ length: primerDia }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 border-b border-r border-teal-50" />
                  ))}

                  {/* Días del mes */}
                  {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
                    const fechaStr = formatearFecha(anio, mes, dia);
                    const citasDia = citasPorFecha[fechaStr] || [];
                    const esHoy    = fechaStr === hoyStr;
                    const esSelec  = diaSeleccionado === dia;

                    return (
                      <div
                        key={dia}
                        onClick={() => setDiaSeleccionado(esSelec ? null : dia)}
                        className={`h-20 border-b border-r border-teal-50 p-1.5 cursor-pointer transition-all hover:bg-emerald-50/60 ${
                          esSelec ? 'bg-emerald-50/80 ring-2 ring-inset ring-emerald-400' : ''
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                          esHoy ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm' : 'text-teal-900'
                        }`}>
                          {dia}
                        </div>

                        {/* Puntos de citas (máx 2 visibles) */}
                        <div className="space-y-0.5">
                          {citasDia.slice(0, 2).map((cita, idx) => {
                            const c = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                            return (
                              <div key={idx}
                                className={`text-[10px] px-1 py-0.5 rounded truncate font-medium ${c.bg} ${c.text}`}
                              >
                                {cita.hora?.slice(0, 5)} {cita.Animal?.nombre}
                              </div>
                            );
                          })}
                          {citasDia.length > 2 && (
                            <p className="text-[10px] text-teal-700/50 pl-1">+{citasDia.length - 2} más</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: PANEL DEL DÍA */}
          <div className="flex flex-col gap-6">
            <div className="tarjeta-petovix aparecer flex flex-col overflow-hidden flex-grow" style={{ animationDelay: '220ms' }}>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4 border-b border-teal-100">
                <h3 className="font-bold text-teal-900">
                  {diaSeleccionado
                    ? `📋 ${diaSeleccionado} de ${MESES[mes]}`
                    : `📋 Hoy — ${hoy.getDate()} de ${MESES[hoy.getMonth()]}`
                  }
                </h3>
                <p className="text-xs text-teal-800/50 mt-0.5">
                  {citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto max-h-[500px] flex-grow">
                {citasDelDia.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm font-bold text-teal-800/60">Sin citas este día</p>
                  </div>
                ) : (
                  citasDelDia.map(cita => {
                    const c = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                    return (
                      <div
                        key={cita.id_cita}
                        onClick={() => setCitaSeleccionada(cita)}
                        className={`p-3 rounded-xl border-l-4 ${c.borde} bg-white/70 hover:bg-teal-50/70 cursor-pointer transition-all border border-teal-50 hover:shadow-sm`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                            <p className="text-sm font-bold text-teal-900">{cita.hora?.slice(0, 5)}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.bg} ${c.text}`}>
                            {cita.estado}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-teal-900 mt-1 truncate">
                          {cita.Animal?.nombre}
                          <span className="font-normal text-teal-800/50 text-xs"> · {cita.Animal?.especie}</span>
                        </p>
                        <p className="text-xs text-teal-800/60 truncate">{cita.motivo}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL DETALLE */}
      {citaSeleccionada && (
        <ModalDetalleCita
          cita={citaSeleccionada}
          onCerrar={() => setCitaSeleccionada(null)}
          onCancelar={handleCancelar}
          onCompletar={handleCompletar}
        />
      )}
      </div>
    </FondoPetovix>
  );
}