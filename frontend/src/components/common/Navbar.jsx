import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { usuario, logout, isAuthenticated } = useAuth();

  // 🌟 NUEVA JERARQUÍA: Definimos los roles basándonos en el usuario actual
  const esAdmin = usuario?.rol === 'Administrador';
  const esTutor = usuario?.rol === 'Tutor';
  // Si no es Admin ni Tutor, asumimos que es Veterinario (o puedes validarlo explícitamente)

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Al salir, recarga en la página pública
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* 🌟 LOGO: Al darle clic siempre te lleva al inicio */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
        <img src="/petovixlogo1.png" alt="Logo" className="h-16 w-24 object-contain" />
        <h1 className="text-xl md:text-2xl font-bold text-green-900">
          PETOVIX
          {/* Título dinámico según el nivel de autoridad */}
          {isAuthenticated && (
            <span className="text-sm font-normal text-gray-500 hidden md:inline ml-2">
              | {esAdmin ? 'Centro de Control Admin' : (esTutor ? 'Portal de Dueños' : 'Panel Veterinario')}
            </span>
          )}
        </h1>
      </Link>
      
      <div className="flex items-center gap-6">
        
        {isAuthenticated ? (
          <>
            {/* 🛡️ ACTUALIZADO: Botón EXCLUSIVO para el Administrador Superior */}
            {esAdmin && (
              <Link 
                to="/panel-admin"
                className="bg-teal-700 text-white font-bold text-sm px-4 py-1.5 rounded-full hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-2"
                title="Centro de Control Global"
              >
                <span>🛡️</span> 
                <span className="hidden md:inline">Panel Admin</span>
              </Link>
            )}

            {/* Muestra Nombre */}
            <span className="text-sm text-gray-600 font-bold hidden md:block border-l-2 border-gray-200 pl-4">
              Hola, {usuario?.nombre}
            </span>
            
            {/* Tuerca de Perfil */}
            <Link 
              to="/perfil"
              className="text-gray-500 hover:text-green-700 transition transform hover:rotate-90 duration-300 text-xl inline-block"
              title="Mi Perfil / Ajustes"
            >
              ⚙️
            </Link>

            {/* Botón Salir */}
            <button 
              onClick={handleLogout}
              className="text-red-500 font-bold hover:text-white text-sm border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-500 transition-colors"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            {/* Si NO está logueado: Muestra solo el botón ENTRAR */}
            <Link 
              to="/login"
              className="bg-green-700 text-white font-bold px-6 py-2 rounded-full hover:bg-green-800 transition-colors shadow-md"
            >
              Entrar
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}