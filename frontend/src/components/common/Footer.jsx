import { FaInstagram, FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-teal-900 to-emerald-900 text-emerald-100 py-8 mt-12 overflow-hidden">

      {/* Manchas decorativas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Contacto */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
          <p className="mb-2">Tel: (555) 123-4567</p>
          <p className="mb-2">Correo: hola@korium.com</p>
          <p>Ubicación: Av. Veterinaria 123, Ciudad.</p>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
          {/* Los íconos heredan el tamaño text-2xl y el color actual */}
          <div className="flex gap-5 text-2xl">
            <a href="#" aria-label="Instagram" className="hover:text-white transition transform hover:scale-110">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition transform hover:scale-110">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter / X" className="hover:text-white transition transform hover:scale-110">
              <FaXTwitter />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-white transition transform hover:scale-110">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Logo y Copyright */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <img src="/logo-petovix.png" alt="Petovix" className="h-16 mb-2 brightness-0 invert opacity-80" />
          <p className="text-sm opacity-70">© 2026 Petovix. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
}