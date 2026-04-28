const Cita = require('../models/Cita');
const Animal = require('../models/Animal');

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

// POST crear cita
exports.crearCita = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const { id_animal, fecha, hora, motivo, notas } = req.body;

        const nuevaCita = await Cita.create({
            id_animal,
            id_usuario,
            fecha,
            hora,
            motivo,
            notas
        });

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