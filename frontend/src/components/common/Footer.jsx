import { FaInstagram, FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Contacto */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
          <p className="mb-2">📞 Tel: (555) 123-4567</p>
          <p className="mb-2">📧 Correo: hola@korium.com</p>
          <p>📍 Ubicación: Av. Veterinaria 123, Ciudad.</p>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
          {/* Los íconos heredarán el tamaño text-2xl y el color actual */}
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
          <img src="/logo-korium.png" alt="Korium" className="h-16 mb-2 brightness-0 invert opacity-80" />
          <p className="text-sm opacity-70">© 2026 KORIUM. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
}