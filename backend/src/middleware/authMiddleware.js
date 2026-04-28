const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Buscamos el token en la cabecera
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, permiso denegado' });
    }

    try {
        // 2. Verificamos que el token sea válido
        const cifrado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
        
        // 3. Guardamos los datos del usuario en la petición
        req.usuario = cifrado; 
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};