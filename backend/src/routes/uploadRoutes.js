// Archivo: src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Configuración de dónde guardar los archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Si el campo se llama 'foto', va a la carpeta fotos
        if (file.fieldname === 'foto') {
            cb(null, 'uploads/fotos/');
        } else if (file.fieldname === 'radiografia') {
            cb(null, 'uploads/radiografias/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        // Generamos un nombre único: foto-123456789.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// RUTA 1: Subir Foto de Perfil de Mascota
// Actualiza la base de datos con la nueva URL
const Animal = require('../models/Animal');

router.post('/foto/:id', upload.single('foto'), async (req, res) => {
    try {
        const { id } = req.params;
        const url_foto = `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`; // Arreglamos las barras para Windows
        
        // Actualizamos el animal en la BD
        await Animal.update({ url_foto }, { where: { id_animal: id } });

        res.json({ mensaje: 'Foto subida con éxito', url: url_foto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// RUTA 2: Subir Radiografía o Documento a un Evento Médico
const HistorialMedico = require('../models/HistorialMedico'); // Asegúrate de tener el modelo importado

router.post('/evidencia/:id_evento', upload.single('radiografia'), async (req, res) => {
    try {
        const { id_evento } = req.params;
        // Creamos la URL para guardar en la BD
        const url_radiografia = `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`;
        
        // Actualizamos el evento médico específico
        await HistorialMedico.update(
            { url_radiografia }, 
            { where: { id_evento: id_evento } }
        );

        res.json({ mensaje: 'Evidencia subida con éxito', url: url_radiografia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

module.exports = router;