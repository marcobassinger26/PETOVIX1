// src/routes/citaRoutes.js
const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/hoy', citaController.getCitasHoy);
router.get('/', citaController.getMisCitas);
router.post('/', citaController.crearCita);
router.put('/:id/estado', citaController.actualizarEstado);
router.delete('/:id', citaController.cancelarCita);

module.exports = router;