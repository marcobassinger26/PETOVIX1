import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const COLOR_ESTADO = {
  Pendiente:  { bg: 'bg-blue-100',  text: 'text-blue-700',  dot: 'bg-blue-500',  borde: 'border-blue-400' },
  Completada: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', borde: 'border-green-400' },
  Cancelada:  { bg: 'bg-red-100',   text: 'text-red-600',   dot: 'bg-red-400',   borde: 'border-red-300' },
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-green-700 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">📋 Detalle de Cita</h3>
          <button onClick={onCerrar} className="text-2xl leading-none hover:text-gray-200">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mascota */}
          <div className="flex items-center gap-3">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              {cita.Animal?.url_foto
                ? <img src={cita.Animal.url_foto} className="w-full h-full object-cover" alt="" />
                : <span className="text-2xl">🐾</span>
              }
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{cita.Animal?.nombre}</p>
              <p className="text-xs text-gray-500">{cita.Animal?.especie} · {cita.Animal?.raza}</p>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Fecha</p>
              <p className="font-bold text-gray-700">
                {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Hora</p>
              <p className="font-bold text-gray-700">{cita.hora?.slice(0, 5)}</p>
            </div>
          </div>

          {/* Motivo */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-xs text-gray-400 mb-1">Motivo</p>
            <p className="font-bold text-gray-700">{cita.motivo}</p>
          </div>

          {/* Veterinario */}
          {cita.Usuario && (
            <div className="bg-green-50 rounded-lg p-3 text-sm border border-green-100">
              <p className="text-xs text-green-600 mb-1">👨‍⚕️ Veterinario</p>
              <p className="font-bold text-green-800">{cita.Usuario.nombre}</p>
            </div>
          )}

          {/* Notas */}
          {cita.notas && (
            <div className="bg-yellow-50 rounded-lg p-3 text-sm border border-yellow-100">
              <p className="text-xs text-yellow-600 mb-1">📝 Notas</p>
              <p className="text-gray-600">{cita.notas}</p>
            </div>
          )}

          {/* Estado */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${color.bg} ${color.text}`}>
              {cita.estado}
            </span>
          </div>

          {/* Solo lectura — aviso */}
          <p className="text-xs text-gray-400 text-center pt-1">
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
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        <button onClick={() => navigate(-1)}
          className="mb-6 bg-white border border-green-200 text-green-800 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-green-50 transition-all flex items-center gap-2 group w-fit"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900"> Mis Citas</h1>
          <p className="text-gray-500 mt-1 text-sm">Aquí puedes ver las citas agendadas para tus mascotas.</p>
        </div>

        {loading ? (
          <LoadingSpinner mensaje="Cargando citas..." />
        ) : citas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-600 font-medium">No tienes citas agendadas aún.</p>
            <p className="text-gray-400 text-sm mt-1">El veterinario las agendará desde su panel.</p>
          </div>
        ) : (
          <>
            {/* Próximas citas destacadas */}
            {proximasCitas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">🔔 Próximas citas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {proximasCitas.map(cita => {
                    const color = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                    return (
                      <div key={cita.id_cita}
                        onClick={() => setCitaSeleccionada(cita)}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden flex items-center justify-center">
                            {cita.Animal?.url_foto
                              ? <img src={cita.Animal.url_foto} className="w-full h-full object-cover" alt="" />
                              : <span className="text-lg">🐾</span>
                            }
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{cita.Animal?.nombre}</p>
                            <p className="text-xs text-gray-400">{cita.Animal?.especie}</p>
                          </div>
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${color.bg} ${color.text}`}>
                            {cita.estado}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          📅 {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {' '} · {' '}
                          🕐 {cita.hora?.slice(0, 5)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{cita.motivo}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* CALENDARIO */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* Header */}
                  <div className="bg-green-700 text-white px-6 py-4 flex items-center justify-between">
                    <button onClick={mesAnterior}
                      className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center font-bold transition"
                    >‹</button>
                    <h2 className="text-xl font-bold">{MESES[mes]} {anio}</h2>
                    <button onClick={mesSiguiente}
                      className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center font-bold transition"
                    >›</button>
                  </div>

                  {/* Filtro por mascota */}
                  {mascotas.length > 1 && (
                    <div className="px-6 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
                      <button onClick={() => setFiltroMascota('Todas')}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${filtroMascota === 'Todas' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Todas
                      </button>
                      {mascotas.map(([id, nombre]) => (
                        <button key={id} onClick={() => setFiltroMascota(nombre)}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${filtroMascota === nombre ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          🐾 {nombre}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Días semana */}
                  <div className="grid grid-cols-7 border-b border-gray-100">
                    {DIAS_SEMANA.map(d => (
                      <div key={d} className="py-3 text-center text-xs font-bold text-gray-400 uppercase">{d}</div>
                    ))}
                  </div>

                  {/* Cuadrícula */}
                  <div className="grid grid-cols-7">
                    {Array.from({ length: primerDia }).map((_, i) => (
                      <div key={`e-${i}`} className="h-20 border-b border-r border-gray-50" />
                    ))}
                    {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
                      const fechaStr = formatearFecha(anio, mes, dia);
                      const citasDia = citasPorFecha[fechaStr] || [];
                      const esHoy   = fechaStr === hoyStr;
                      const esSelec = diaSeleccionado === dia;

                      return (
                        <div key={dia}
                          onClick={() => setDiaSeleccionado(esSelec ? null : dia)}
                          className={`h-20 border-b border-r border-gray-50 p-1.5 cursor-pointer transition-all hover:bg-green-50 ${esSelec ? 'bg-green-50 ring-2 ring-inset ring-green-400' : ''}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${esHoy ? 'bg-green-700 text-white' : 'text-gray-700'}`}>
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
                              <p className="text-[10px] text-gray-400 pl-1">+{citasDia.length - 2} más</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PANEL DEL DÍA */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="bg-green-50 px-5 py-4 border-b border-green-100">
                  <h3 className="font-bold text-green-900">
                    {diaSeleccionado
                      ? ` ${diaSeleccionado} de ${MESES[mes]}`
                      : ` Hoy — ${hoy.getDate()} de ${MESES[hoy.getMonth()]}`
                    }
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{citasDelDia.length} cita{citasDelDia.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto max-h-[500px]">
                  {citasDelDia.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="text-sm font-bold text-gray-500">Sin citas este día</p>
                    </div>
                  ) : (
                    citasDelDia.map(cita => {
                      const c = COLOR_ESTADO[cita.estado] || COLOR_ESTADO.Pendiente;
                      return (
                        <div key={cita.id_cita}
                          onClick={() => setCitaSeleccionada(cita)}
                          className={`p-3 rounded-xl border-l-4 ${c.borde} bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                              <p className="text-sm font-bold text-gray-800">{cita.hora?.slice(0, 5)}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.bg} ${c.text}`}>{cita.estado}</span>
                          </div>
                          <p className="text-sm font-bold text-gray-700 mt-1 truncate">
                            {cita.Animal?.nombre}
                            <span className="font-normal text-gray-400 text-xs"> · {cita.Animal?.especie}</span>
                          </p>
                          <p className="text-xs text-gray-500 truncate">{cita.motivo}</p>
                          {cita.Usuario && (
                            <p className="text-xs text-green-600 mt-1">veterinario: {cita.Usuario.nombre}</p>
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
    </div>
  );
}