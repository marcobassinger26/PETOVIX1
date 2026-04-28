// Archivo: src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const HistorialMedico = require('../models/HistorialMedico');
const { sequelize } = require('../config/database'); 

exports.getVeterinarios = async (req, res) => {
    try {
        // 🛡️ SUPERVISIÓN DE ADMINISTRADOR:
        // Buscamos a los veterinarios y contamos sus pacientes únicos atendidos
        const veterinarios = await Usuario.findAll({
            where: { 
                rol: 'Veterinario' 
            },
            attributes: [
                'id_usuario', 
                'nombre', 
                'email', 
                'rol',
                // 📊 Cálculo en tiempo real usando el nombre EXACTO de tu tabla
                [
                    sequelize.literal(`(
                        SELECT COUNT(DISTINCT id_animal)
                        FROM historial_medico
                        WHERE historial_medico.id_usuario = Usuario.id_usuario
                    )`), 
                    'total_pacientes'
                ]
            ],
            order: [['nombre', 'ASC']]
        });

        res.json(veterinarios);
    } catch (error) {
        console.error("Error al obtener veterinarios:", error);
        res.status(500).json({ error: 'Error interno del servidor al cargar el personal' });
    }
};

// 🗑️ Eliminar un veterinario del sistema
exports.eliminarVeterinario = async (req, res) => {
    try {
        const { id } = req.params;

        // Borramos al usuario de la base de datos
        const resultado = await Usuario.destroy({ 
            where: { id_usuario: id } 
        });

        if (resultado === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Veterinario dado de baja correctamente' });
    } catch (error) {
        console.error("Error al eliminar veterinario:", error);
        res.status(500).json({ error: 'Error interno al intentar dar de baja' });
    }
};