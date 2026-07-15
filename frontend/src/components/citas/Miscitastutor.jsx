import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import FondoPetovix from '../common/FondoPetovix';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const COLOR_ESTADO = {
  Pendiente:  { bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500',    borde: 'border-teal-400' },
  Completada: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', borde: 'border-emerald-400' },
  Cancelada:  { bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400',     borde: 'border-red-300' },
};

function formatearFecha(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

// Modal detalle — solo lectura para el tutor
function ModalDetalleCita({ cita, onCerrar }) {
  if (!cita) return null;
  const color = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden aparecer">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">📋 Detalle de Cita</h3>
          <button onClick={onCerrar} className="text-2xl leading-none hover:text-teal-100 transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mascota */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              {cita.Animal?.url_foto
                ? <img src={cita.Animal.url_foto} className="w-full h-full object-cover" alt="" />
                : <span className="text-2xl">🐾</span>
              }
            </div>
            <div>
              <p className="font-bold text-teal-900 text-lg">{cita.Animal?.nombre}</p>
              <p className="text-xs text-teal-800/60">{cita.Animal?.especie} · {cita.Animal?.raza}</p>
            </div>
          </div>

          {/* Fecha y hora */}
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

          {/* Motivo */}
          <div className="bg-teal-50/70 rounded-xl p-3 text-sm">
            <p className="text-xs text-teal-700/60 mb-1">Motivo</p>
            <p className="font-bold text-teal-900">{cita.motivo}</p>
          </div>

          {/* Veterinario */}
          {cita.Usuario && (
            <div className="bg-emerald-50/80 rounded-xl p-3 text-sm border border-emerald-100">
              <p className="text-xs text-emerald-600 mb-1">👨‍⚕️ Veterinario</p>
              <p className="font-bold text-teal-900">{cita.Usuario.nombre}</p>
            </div>
          )}

          {/* Notas */}
          {cita.notas && (
            <div className="bg-amber-50 rounded-xl p-3 text-sm border border-amber-100">
              <p className="text-xs text-amber-600 mb-1">📝 Notas</p>
              <p className="text-teal-800/80">{cita.notas}</p>
            </div>
          )}

          {/* Estado */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${color.bg} ${color.text}`}>
              {cita.estado}
            </span>
          </div>

          {/* Solo lectura — aviso */}
          <p className="text-xs text-teal-800/50 text-center pt-1">
            Para cambios en la cita, contacta a tu veterinario.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MisCitasTutor() {
  const navigate = useNavigate();
  const hoy = new Date();
  const hoyStr = hoy.toISOString().split('T')[0];

  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes]   = useState(hoy.getMonth());
  const [citas, setCitas]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado]   = useState(null);
  const [filtroMascota, setFiltroMascota] = useState('Todas');

  const cargarCitas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/citas/tutor/mis-citas');
      setCitas(data);
    } catch {
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

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

  // Lista única de mascotas para el filtro
  const mascotas = [...new Map(citas.map(c => [c.id_animal, c.Animal?.nombre])).entries()];

  const citasFiltradas = filtroMascota === 'Todas'
    ? citas
    : citas.filter(c => c.Animal?.nombre === filtroMascota);

  const citasPorFecha = citasFiltradas.reduce((acc, c) => {
    if (!acc[c.fecha]) acc[c.fecha] = [];
    acc[c.fecha].push(c);
    return acc;
  }, {});

  const fechaDiaPanel = diaSeleccionado
    ? formatearFecha(anio, mes, diaSeleccionado)
    : hoyStr;
  const citasDelDia = (citasPorFecha[fechaDiaPanel] || [])
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const { primerDia, totalDias } = (() => {
    return {
      primerDia: new Date(anio, mes, 1).getDay(),
      totalDias: new Date(anio, mes + 1, 0).getDate()
    };
  })();

  // Próximas citas (futuras o de hoy, pendientes)
  const proximasCitas = citas
    .filter(c => c.fecha >= hoyStr && c.estado === 'Pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))
    .slice(0, 5);

  return (
    <FondoPetovix>
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        <button onClick={() => navigate(-1)}
          className="boton-petovix-secundario aparecer mb-6 !py-2 !px-4 text-sm flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver
        </button>

        <div className="mb-6 aparecer">
          <h1 className="text-3xl font-extrabold text-teal-900">
            Mis <span className="titulo-degradado">Citas</span>
          </h1>
          <p className="text-teal-800/60 mt-1 text-sm">Aquí puedes ver las citas agendadas para tus mascotas.</p>
        </div>

        {loading ? (
          <LoadingSpinner mensaje="Cargando citas..." />
        ) : citas.length === 0 ? (
          <div className="tarjeta-petovix aparecer text-center py-20 border-dashed !border-teal-200">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-teal-900 font-medium">No tienes citas agendadas aún.</p>
            <p className="text-teal-800/50 text-sm mt-1">El veterinario las agendará desde su panel.</p>
          </div>
        ) : (
          <>
            {/* Próximas citas destacadas */}
            {proximasCitas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-teal-700/70 uppercase tracking-wider mb-3">🔔 Próximas citas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {proximasCitas.map((cita, index) => {
                    const color = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                    return (
                      <div key={cita.id_cita}
                        onClick={() => setCitaSeleccionada(cita)}
                        className="tarjeta-petovix tarjeta-petovix-hover aparecer p-4 cursor-pointer"
                        style={{ animationDelay: `${Math.min(index * 70, 350)}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden flex items-center justify-center">
                            {cita.Animal?.url_foto
                              ? <img src={cita.Animal.url_foto} className="w-full h-full object-cover" alt="" />
                              : <span className="text-lg">🐾</span>
                            }
                          </div>
                          <div>
                            <p className="font-bold text-teal-900 text-sm">{cita.Animal?.nombre}</p>
                            <p className="text-xs text-teal-800/50">{cita.Animal?.especie}</p>
                          </div>
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${color.bg} ${color.text}`}>
                            {cita.estado}
                          </span>
                        </div>
                        <p className="text-xs text-teal-800/80 font-medium">
                          📅 {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {' '} · {' '}
                          🕐 {cita.hora?.slice(0, 5)}
                        </p>
                        <p className="text-xs text-teal-800/50 mt-1 truncate">{cita.motivo}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* CALENDARIO */}
              <div className="lg:col-span-2">
                <div className="tarjeta-petovix aparecer overflow-hidden" style={{ animationDelay: '150ms' }}>

                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
                    <button onClick={mesAnterior}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
                    >‹</button>
                    <h2 className="text-xl font-bold">{MESES[mes]} {anio}</h2>
                    <button onClick={mesSiguiente}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
                    >›</button>
                  </div>

                  {/* Filtro por mascota */}
                  {mascotas.length > 1 && (
                    <div className="px-6 py-3 border-b border-teal-100 flex gap-2 flex-wrap">
                      <button onClick={() => setFiltroMascota('Todas')}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${filtroMascota === 'Todas' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                      >
                        Todas
                      </button>
                      {mascotas.map(([id, nombre]) => (
                        <button key={id} onClick={() => setFiltroMascota(nombre)}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${filtroMascota === nombre ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                        >
                          🐾 {nombre}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Días semana */}
                  <div className="grid grid-cols-7 border-b border-teal-100">
                    {DIAS_SEMANA.map(d => (
                      <div key={d} className="py-3 text-center text-xs font-bold text-teal-700/50 uppercase">{d}</div>
                    ))}
                  </div>

                  {/* Cuadrícula */}
                  <div className="grid grid-cols-7">
                    {Array.from({ length: primerDia }).map((_, i) => (
                      <div key={`e-${i}`} className="h-20 border-b border-r border-teal-50" />
                    ))}
                    {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
                      const fechaStr = formatearFecha(anio, mes, dia);
                      const citasDia = citasPorFecha[fechaStr] || [];
                      const esHoy   = fechaStr === hoyStr;
                      const esSelec = diaSeleccionado === dia;

                      return (
                        <div key={dia}
                          onClick={() => setDiaSeleccionado(esSelec ? null : dia)}
                          className={`h-20 border-b border-r border-teal-50 p-1.5 cursor-pointer transition-all hover:bg-emerald-50/60 ${esSelec ? 'bg-emerald-50/80 ring-2 ring-inset ring-emerald-400' : ''}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${esHoy ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm' : 'text-teal-900'}`}>
                            {dia}
                          </div>
                          <div className="space-y-0.5">
                            {citasDia.slice(0, 2).map((cita, idx) => {
                              const c = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                              return (
                                <div key={idx} className={`text-[10px] px-1 py-0.5 rounded truncate font-medium ${c.bg} ${c.text}`}>
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
                </div>
              </div>

              {/* PANEL DEL DÍA */}
              <div className="tarjeta-petovix aparecer overflow-hidden flex flex-col" style={{ animationDelay: '220ms' }}>
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4 border-b border-teal-100">
                  <h3 className="font-bold text-teal-900">
                    {diaSeleccionado
                      ? `📋 ${diaSeleccionado} de ${MESES[mes]}`
                      : `📋 Hoy — ${hoy.getDate()} de ${MESES[hoy.getMonth()]}`
                    }
                  </h3>
                  <p className="text-xs text-teal-800/50 mt-0.5">{citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto max-h-[500px]">
                  {citasDelDia.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="text-sm font-bold text-teal-800/60">Sin citas este día</p>
                    </div>
                  ) : (
                    citasDelDia.map(cita => {
                      const c = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                      return (
                        <div key={cita.id_cita}
                          onClick={() => setCitaSeleccionada(cita)}
                          className={`p-3 rounded-xl border-l-4 ${c.borde} bg-white/70 hover:bg-teal-50/70 cursor-pointer transition-all border border-teal-50 hover:shadow-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                              <p className="text-sm font-bold text-teal-900">{cita.hora?.slice(0, 5)}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.bg} ${c.text}`}>{cita.estado}</span>
                          </div>
                          <p className="text-sm font-bold text-teal-900 mt-1 truncate">
                            {cita.Animal?.nombre}
                            <span className="font-normal text-teal-800/50 text-xs"> · {cita.Animal?.especie}</span>
                          </p>
                          <p className="text-xs text-teal-800/60 truncate">{cita.motivo}</p>
                          {cita.Usuario && (
                            <p className="text-xs text-emerald-600 mt-1">👨‍⚕️ {cita.Usuario.nombre}</p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {citaSeleccionada && (
        <ModalDetalleCita
          cita={citaSeleccionada}
          onCerrar={() => setCitaSeleccionada(null)}
        />
      )}
    </FondoPetovix>
  );
}