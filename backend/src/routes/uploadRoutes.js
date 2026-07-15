// Archivo: src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'foto') {
            cb(null, 'uploads/fotos/');
        } else if (file.fieldname === 'radiografia') {
            cb(null, 'uploads/radiografias/');
        } else if (file.fieldname === 'imagen') {
            cb(null, 'uploads/perfiles/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
    fileFilter: (req, file, cb) => {
        const permitidos = /jpeg|jpg|png|webp/;
        const ext = permitidos.test(path.extname(file.originalname).toLowerCase());
        const mime = permitidos.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Solo se permiten imágenes (jpg, png, webp)'));
    }
});

const Animal = require('../models/Animal');
const HistorialMedico = require('../models/HistorialMedico');
const Usuario = require('../models/Usuario');

// RUTA 1: Foto de mascota
router.post('/foto/:id', upload.single('foto'), async (req, res) => {
    try {
        const { id } = req.params;
        const url_foto = `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`;
        await Animal.update({ url_foto }, { where: { id_animal: id } });
        res.json({ mensaje: 'Foto subida con éxito', url: url_foto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// RUTA 2: Radiografía / evidencia médica
router.post('/evidencia/:id_evento', upload.single('radiografia'), async (req, res) => {
    try {
        const { id_evento } = req.params;
        const url_radiografia = `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`;
        await HistorialMedico.update({ url_radiografia }, { where: { id_evento } });
        res.json({ mensaje: 'Evidencia subida con éxito', url: url_radiografia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ RUTA 3: Foto de perfil del usuario logueado
router.post('/foto-perfil', authMiddleware, upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: 'No se recibió ninguna imagen.' });
        }

        const id_usuario = req.usuario.id;
        const url = `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`;

        await Usuario.update({ foto_perfil: url }, { where: { id_usuario } });

        res.json({ mensaje: 'Foto de perfil actualizada', url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;