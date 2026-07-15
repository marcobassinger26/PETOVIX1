// Archivo: src/components/common/FondoPetovix.jsx
// 🌿 Fondo animado PETOVIX: manchas verdes/teal difuminadas que flotan suavemente.
// Envuelve cualquier pantalla con <FondoPetovix> ... </FondoPetovix> para darle la identidad visual.

export default function FondoPetovix({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-teal-50 via-white to-emerald-50 overflow-hidden">

      {/* 🫧 Manchas flotantes de fondo (decorativas, no interceptan clics) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="blob-petovix blob-1 bg-emerald-200/40" />
        <div className="blob-petovix blob-2 bg-teal-200/40" />
        <div className="blob-petovix blob-3 bg-emerald-100/50" />
      </div>

      {/* Contenido de la pantalla, por encima del fondo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}