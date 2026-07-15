import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function NuestroEquipo() {
  const [equipo, setEquipo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        // Ruta PÚBLICA: solo devuelve nombre, foto, especialidad y bio
        const response = await api.get('/publico/veterinarios');
        setEquipo(response.data);
      } catch (err) {
        console.error('Error al cargar el equipo:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargarEquipo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-emerald-50">

      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center">
        {/* Manchas decorativas de fondo */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-16 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide">
            🐾 Equipo médico PETOVIX
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-teal-900 leading-tight">
            En las mejores{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              manos
            </span>
          </h1>
          <p className="mt-6 text-lg text-teal-800/80 leading-relaxed">
            Conoce a los héroes de bata blanca de PETOVIX. Nuestro equipo de
            médicos veterinarios está altamente capacitado y listo para tratar
            a tu mascota como parte de su propia familia.
          </p>
        </div>
      </section>

      {/* 👨‍⚕️ TARJETAS DEL EQUIPO */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-teal-700 font-medium">
              Cargando directorio médico...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur rounded-3xl border border-teal-100">
            <p className="text-teal-700">
              No pudimos cargar el directorio en este momento. Intenta de nuevo
              más tarde.
            </p>
          </div>
        ) : equipo.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur rounded-3xl border border-teal-100">
            <p className="text-teal-700">
              Aún no hay médicos registrados en el directorio público.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {equipo.map((medico) => (
              <article
                key={medico.id ?? medico.nombre}
                className="group relative bg-white/70 backdrop-blur-md border border-white/60
                           rounded-3xl shadow-lg shadow-teal-900/5 overflow-hidden
                           transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                           hover:shadow-emerald-900/10"
              >
                {/* Franja superior de color */}
                <div className="h-24 bg-gradient-to-r from-emerald-400 to-teal-500" />

                {/* Foto de perfil / placeholder */}
                <div className="relative -mt-14 flex justify-center">
                  {medico.foto_perfil ? (
                    <img
                      src={medico.foto_perfil}
                      alt={`Fotografía de ${medico.nombre}`}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md"
                    />
                  ) : (
                    <div
                      className="w-28 h-28 rounded-full ring-4 ring-white shadow-md
                                 bg-gradient-to-br from-teal-500 to-emerald-600
                                 flex items-center justify-center text-white text-4xl font-bold"
                      aria-hidden="true"
                    >
                      {medico.nombre?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Badge flotante */}
                  <span
                    className="absolute -bottom-3 px-3 py-1 rounded-full text-xs font-semibold
                               bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm"
                  >
                    Médico Veterinario
                  </span>
                </div>

                {/* Info */}
                <div className="px-6 pt-8 pb-7 text-center">
                  <h2 className="text-xl font-bold text-teal-900">
                    Dr. {medico.nombre}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    {medico.especialidad || 'Medicina General Preventiva'}
                  </p>
                  <p className="mt-4 text-sm text-teal-800/70 leading-relaxed">
                    {medico.bio ||
                      'Apasionado por el bienestar animal. Comprometido con brindar la mejor atención clínica y trato humano a cada paciente que cruza nuestras puertas.'}
                  </p>

                  {medico.anios_experiencia && (
                    <p className="mt-4 inline-flex items-baseline gap-1.5 text-teal-900">
                      <span className="text-2xl font-extrabold text-emerald-600">
                        {medico.anios_experiencia}+
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-teal-700/70">
                        años de experiencia
                      </span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className="px-6 pb-24">
        <div
          className="max-w-4xl mx-auto text-center rounded-3xl px-8 py-14
                     bg-gradient-to-r from-teal-600 to-emerald-600 shadow-xl shadow-teal-900/20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            ¿Tu mascota necesita atención?
          </h2>
          <p className="mt-3 text-teal-50/90 max-w-xl mx-auto">
            Crea tu cuenta en menos de un minuto y elige al médico ideal para
            tu compañero.
          </p>
          <Link
            to="/login"
            className="inline-block mt-8 px-8 py-4 rounded-full bg-white text-teal-700
                       font-bold text-lg shadow-lg transition-transform duration-200
                       hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Regístrate y agenda una cita 🐶
          </Link>
        </div>
      </section>
    </div>
  );
}