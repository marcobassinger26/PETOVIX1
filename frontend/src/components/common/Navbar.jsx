import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { usuario, logout, isAuthenticated, esAdministrador, esVeterinario, esTutor } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-white/60 shadow-sm shadow-teal-900/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
        <img src="/petovixlogo1.png" alt="Logo" className="h-16 w-24 object-contain" />
        <h1 className="text-xl md:text-2xl font-bold text-teal-900">
          PETOVIX
          {isAuthenticated && (
            <span className="text-sm font-normal text-teal-800/60 hidden md:inline ml-2">
              | {esAdministrador ? 'Centro de Control Admin' : (esTutor ? 'Portal de Dueños' : 'Panel Veterinario')}
            </span>
          )}
        </h1>
      </Link>

      <div className="flex items-center gap-4">

        {/* 🌟 ENLACE PÚBLICO: Visible siempre */}
        <Link
          to="/nuestro-equipo"
          className="text-teal-800/70 font-bold text-sm hover:text-teal-700 transition-colors flex items-center gap-1.5 mr-2"
        >
          <span className="text-lg">👩‍⚕️</span>
          <span className="hidden md:inline">Nuestro Equipo</span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Botón Panel Admin */}
            {esAdministrador && (
              <Link to="/panel-admin"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm px-4 py-1.5 rounded-full hover:scale-105 transition-transform shadow-sm flex items-center gap-2"
              >
                <span>🛡️</span>
                <span className="hidden md:inline">Panel Admin</span>
              </Link>
            )}

            {/* ✅ Botón Mis Citas — solo para tutores */}
            {esTutor && (
              <Link to="/mis-citas"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm px-4 py-1.5 rounded-full hover:scale-105 transition-transform shadow-sm flex items-center gap-2"
              >
                <span>📅</span>
                <span className="hidden md:inline">Mis Citas</span>
              </Link>
            )}

            {/* Nombre del usuario */}
            <span className="text-sm text-teal-800/70 font-bold hidden md:block border-l-2 border-teal-100 pl-4">
              Hola, {usuario?.nombre}
            </span>

            {/* Perfil */}
            <Link to="/perfil"
              className="text-teal-800/50 hover:text-teal-700 transition transform hover:rotate-90 duration-300 text-xl inline-block"
              title="Mi Perfil / Ajustes"
            >
              ⚙️
            </Link>

            {/* Salir */}
            <button onClick={handleLogout}
              className="text-red-500 font-bold hover:text-white text-sm border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-500 transition-colors"
            >
              Salir
            </button>
          </>
        ) : (
          <Link to="/login"
            className="boton-petovix !px-6 !py-2 text-sm"
          >
            Entrar
          </Link>
        )}

      </div>
    </nav>
  );
}