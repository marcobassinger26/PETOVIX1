import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import FondoPetovix from '../common/FondoPetovix';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 👁️ Controla si la contraseña se ve o está oculta
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
        window.location.href = '/';
      } else {
        await register(
          formData.nombre,
          formData.email,
          formData.password,
          ROLES.TUTOR
        );
        alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión para vincular a tus mascotas.");
        setIsLoginMode(true);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FondoPetovix>
      <div className="min-h-screen flex items-center justify-center font-sans p-4">
      <div className="relative flex w-full max-w-4xl h-[650px] rounded-3xl shadow-2xl shadow-teal-900/15 overflow-hidden bg-white/50 backdrop-blur-md border border-white/60 aparecer">

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center text-teal-900 z-10">
          <div className="flex justify-center mb-4">
            <img src="/petovixlogo1.png" alt="Logo" className="h-24 w-auto object-contain" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center text-teal-900">
            {isLoginMode
              ? <>Iniciar <span className="titulo-degradado">Sesión</span></>
              : <>Crear <span className="titulo-degradado">Cuenta</span></>}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-center text-sm mb-4 border border-red-200 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5 px-4">
            {!isLoginMode && (
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-teal-200 py-2 outline-none focus:border-emerald-500 transition-colors placeholder:text-teal-800/40"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b-2 border-teal-200 py-2 outline-none focus:border-emerald-500 transition-colors placeholder:text-teal-800/40 mt-4"
            />

            {/* 👁️ CONTENEDOR DE LA CONTRASEÑA CON EL OJITO */}
            <div className="relative w-full">
              <input
                // Cambia dinámicamente entre 'text' y 'password'
                type={mostrarPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
                minLength="6"
                className="w-full bg-transparent border-b-2 border-teal-200 py-2 pr-10 outline-none focus:border-emerald-500 transition-colors placeholder:text-teal-800/40"
              />

              {/* Botón del ojito posicionado a la derecha */}
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-800/50 hover:text-teal-700 focus:outline-none transition-colors"
                title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {mostrarPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="boton-petovix w-full mt-6"
            >
              {loading ? 'Procesando...' : (isLoginMode ? 'Entrar' : 'Registrar Cuenta')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                // Limpiamos el formulario al cambiar de modo
                setFormData({ nombre: '', email: '', password: '' });
                // Reseteamos el ojito
                setMostrarPassword(false);
              }}
              className="font-bold text-teal-800 hover:text-emerald-600 hover:underline transition-colors"
            >
              {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
            </button>
          </div>
        </div>

        {/* Imagen Decorativa */}
        <div className="hidden md:block w-1/2 relative bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1000&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
            alt="Veterinaria"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-emerald-900/50 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-white text-2xl font-bold">Bienvenido a PETOVIX 🐾</p>
            <p className="text-emerald-200 text-sm mt-1">Tecnología veterinaria para tus mejores amigos.</p>
          </div>
        </div>
      </div>
      </div>
    </FondoPetovix>
  );
}