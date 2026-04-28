// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const authMiddleware = require('../middleware/authMiddleware');

// GET todos los clientes (solo veterinarios)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            order: [['nombre_completo', 'ASC']]
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;