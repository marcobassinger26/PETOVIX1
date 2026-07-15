const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authMiddleware = require('../middleware/authMiddleware');
const { verificarRol } = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Rutas del veterinario/admin
router.get('/hoy', citaController.getCitasHoy);
router.get('/', citaController.getMisCitas);
router.post('/', verificarRol(['Veterinario', 'Administrador']), citaController.crearCita);
router.put('/:id/estado', verificarRol(['Veterinario', 'Administrador']), citaController.actualizarEstado);
router.delete('/:id', verificarRol(['Veterinario', 'Administrador']), citaController.cancelarCita);

// ✅ Ruta exclusiva para tutores (solo lectura)
router.get('/tutor/mis-citas', verificarRol(['Tutor']), citaController.getCitasTutor);

module.exports = router;