const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const authMiddleware = require('../middleware/authMiddleware');
const { verificarRol } = require('../middleware/roleMiddleware');

// Rutas específicas PRIMERO
router.get('/mis-pacientes', authMiddleware, animalController.getMisPacientes);
router.get('/chip/:chip',    animalController.buscarPorMicrochip);

// Rutas dinámicas
router.get('/',    animalController.getAllAnimals);
router.get('/:id', animalController.getPerfilCompleto);

// Rutas protegidas — animales
router.post('/',              authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.crearAnimal);
router.post('/vincular-chip', authMiddleware, animalController.vincularPorChip);
router.put('/:id',            authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.actualizarAnimal);

// Rutas protegidas — historial
router.post('/:id/historial',            authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.agregarEvento);
router.put('/historial/:id_evento',      authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.editarEvento);
router.delete('/historial/:id_evento',   authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.eliminarEvento);

// Rutas protegidas — tutor
router.post('/:id/tutor',          authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.registrarTutor);
router.put('/tutor/:id_cliente',   authMiddleware, verificarRol(['Veterinario', 'Administrador']), animalController.actualizarTutor);

module.exports = router;