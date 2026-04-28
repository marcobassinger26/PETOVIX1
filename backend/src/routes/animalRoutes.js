
const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const authMiddleware = require('../middleware/authMiddleware');

// Cuando alguien entre a la raíz de esta ruta, ejecutamos el controlador
router.get('/', animalController.getAllAnimals);


router.get('/chip/:chip', animalController.buscarPorMicrochip);

// 👇 NUEVA — antes de router.get('/:id', ...)
router.get('/mis-pacientes', authMiddleware, animalController.getMisPacientes);

router.get('/:id', animalController.getPerfilCompleto);

router.post('/:id/historial',authMiddleware, animalController.agregarEvento);

router.post('/:id/tutor', animalController.registrarTutor);

router.post('/vincular', animalController.vincularMascota);

router.post('/', animalController.crearAnimal);

router.put('/:id', animalController.actualizarAnimal);

// Ruta para actualizar los datos del tutor
router.put('/tutor/:id_cliente', animalController.actualizarTutor);

// 🔗 Ruta para que el tutor vincule a su mascota usando solo el CHIP
router.post('/vincular-chip', authMiddleware, animalController.vincularMascota);



module.exports = router;