const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 Asegúrate de que este archivo exista

// RUTA DE REGISTRO
// Verifica que authController.register esté bien escrito en el controlador
router.post('/register', authController.register);

// RUTA DE LOGIN
// Verifica que authController.login esté bien escrito en el controlador
router.post('/login', authController.login);

// RUTA DE PERFIL (Aquí es donde suele estar el error)
// Verifica que uses 'authMiddleware' (el guardia) y 'authController.updateProfile'
router.put('/perfil', authMiddleware, authController.updateProfile);

module.exports = router;