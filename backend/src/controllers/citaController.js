const Cita = require('../models/Cita');
const Animal = require('../models/Animal');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

// GET citas de hoy del veterinario logueado
exports.getCitasHoy = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const hoy = new Date().toISOString().split('T')[0];

        const citas = await Cita.findAll({
            where: { id_usuario, fecha: hoy },
            include: [{ model: Animal, attributes: ['nombre', 'especie', 'raza'] }],
            order: [['hora', 'ASC']]
        });

        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET todas las citas del veterinario
exports.getMisCitas = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        const citas = await Cita.findAll({
            where: { id_usuario },
            include: [{ model: Animal, attributes: ['nombre', 'especie', 'raza', 'url_foto'] }],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });

        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ NUEVO: GET citas de las mascotas del tutor logueado (solo lectura)
exports.getCitasTutor = async (req, res) => {
    try {
        const id_cliente = req.usuario.id_cliente;

        if (!id_cliente) {
            return res.status(403).json({ mensaje: 'Solo los tutores pueden usar este endpoint.' });
        }

        // Buscamos todos los animales del tutor
        const animales = await Animal.findAll({
            where: { id_cliente },
            attributes: ['id_animal']
        });

        if (animales.length === 0) {
            return res.json([]);
        }

        const ids = animales.map(a => a.id_animal);

        const citas = await Cita.findAll({
            where: { id_animal: ids },
            include: [
                { model: Animal, attributes: ['nombre', 'especie', 'raza', 'url_foto'] },
                { model: Usuario, attributes: ['nombre'] } // nombre del veterinario
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });

        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST crear cita
exports.crearCita = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const { id_animal, fecha, hora, motivo, notas } = req.body;

        const hoy = new Date().toISOString().split('T')[0];
        if (fecha < hoy) {
            return res.status(400).json({ mensaje: 'No se pueden agendar citas en fechas pasadas.' });
        }

        const nuevaCita = await Cita.create({ id_animal, id_usuario, fecha, hora, motivo, notas });

        const citaCompleta = await Cita.findByPk(nuevaCita.id_cita, {
            include: [{ model: Animal, attributes: ['nombre', 'especie', 'raza'] }]
        });

        res.status(201).json(citaCompleta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT actualizar estado
exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

        await cita.update({ estado });
        res.json({ mensaje: 'Estado actualizado', cita });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE cancelar cita
exports.cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

        await cita.update({ estado: 'Cancelada' });
        res.json({ mensaje: 'Cita cancelada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};