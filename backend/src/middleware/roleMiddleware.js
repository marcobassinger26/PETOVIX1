// Archivo: backend/src/middleware/roleMiddleware.js

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificamos que el usuario exista (puesto ahí por el authMiddleware)
        if (!req.usuario) {
            return res.status(401).json({ mensaje: "No autenticado" });
        }

        // 2. Comparamos su rol con los roles que autorizamos para esta ruta
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                mensaje: "Acceso denegado: Tu rol no tiene permisos para esta acción." 
            });
        }

        // 3. Todo en orden, lo dejamos pasar al controlador
        next(); 
    };
};

module.exports = { verificarRol };