// routes/publico.routes.js
// Ruta PÚBLICA — sin middleware de autenticación.
// Expone EXCLUSIVAMENTE datos no sensibles del equipo médico.

const express = require('express');
const router = express.Router();
const { Usuario } = require('../models'); // Ajusta al nombre real de tu modelo

// GET /api/publico/veterinarios
router.get('/veterinarios', async (req, res) => {
  try {
    const veterinarios = await Usuario.findAll({
      where: { rol: 'Veterinario' },
      // 🔒 CLAVE: solo estos campos salen al público.
      // Nada de email, password, teléfono ni IDs internos sensibles.
      attributes: ['id', 'nombre', 'foto_perfil', 'especialidad', 'bio'],
      order: [['nombre', 'ASC']],
    });

    res.json(veterinarios);
  } catch (error) {
    console.error('Error al obtener veterinarios públicos:', error);
    res.status(500).json({ mensaje: 'Error al obtener el equipo médico' });
  }
});

module.exports = router;

/*
 * En tu server.js / app.js, monta la ruta ANTES de cualquier
 * middleware de autenticación global:
 *
 *   const publicoRoutes = require('./routes/publico.routes');
 *   app.use('/api/publico', publicoRoutes);
 *
 * Si aún no tienes las columnas nuevas, agrégalas en MySQL:
 *
 *   ALTER TABLE usuarios
 *     ADD COLUMN especialidad VARCHAR(100) NULL,
 *     ADD COLUMN bio TEXT NULL,
 *     ADD COLUMN anios_experiencia INT NULL;
 */