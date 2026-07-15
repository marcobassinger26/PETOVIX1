const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// 🛡️ IMPORTACIÓN CORREGIDA: Sin las llaves { }
const authMiddleware = require('../middleware/authMiddleware'); 
const { verificarRol } = require('../middleware/roleMiddleware');

// 🔒 RUTA PROTEGIDA (¡NUEVO CANDADO!): Solo el Jefe puede ver la lista
router.get('/veterinarios', 
    authMiddleware,                      // Candado 1: Debes haber iniciado sesión
    verificarRol(['Administrador']),     // Candado 2: Tienes que ser Administrador Superior
    usuarioController.getVeterinarios
);

// 🔒 RUTA PROTEGIDA: Solo el Jefe puede editar los datos de un veterinario
router.put('/veterinarios/:id', 
    authMiddleware,                      // Candado 1
    verificarRol(['Administrador']),     // Candado 2
    usuarioController.actualizarVeterinario
);

// 🔒 RUTA PROTEGIDA: Solo el Jefe puede eliminar personal
router.delete('/veterinarios/:id', 
    authMiddleware,                      // Candado 1
    verificarRol(['Administrador']),     // Candado 2
    usuarioController.eliminarVeterinario 
);


// Agrega esta línea para crear la ruta pública:
router.get('/equipo-medico', usuarioController.getEquipoMedico);

module.exports = router;