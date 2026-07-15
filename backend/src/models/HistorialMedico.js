// Archivo: src/models/HistorialMedico.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Animal = require('./Animal');

const HistorialMedico = sequelize.define('HistorialMedico', {
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Veterinario que registró el evento'
    },
    id_animal: {
        type: DataTypes.INTEGER,
        references: { model: Animal, key: 'id_animal' }
    },
    tipo_evento: {
        type: DataTypes.ENUM('Vacuna', 'Desparasitacion', 'Estudio', 'Medicamento', 'Nota Medica'),
        allowNull: false
    },
    descripcion_producto: {
        type: DataTypes.STRING(150),
        comment: 'Nombre de la vacuna, desparasitante o estudio'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    veterinaria_nombre: {
        type: DataTypes.STRING(150),
        comment: 'Quién aplicó la vacuna'
    },
    problemas_presentados: {
        type: DataTypes.TEXT,
        comment: 'Solo para diagnósticos o notas'
    },
    hallazgos_estudio: {
        type: DataTypes.TEXT,
        comment: 'Resultados de radiografías o análisis'
    },
    url_radiografia: {
        type: DataTypes.STRING(255),
        comment: 'Ruta de la imagen si es una radiografía'
    },
    // ── Campos nuevos ──────────────────────────────────────────
    lote_vacuna: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Número de lote de la vacuna'
    },
    fecha_refuerzo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha programada para el refuerzo'
    },
    peso_kg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Peso del animal al momento del evento'
    },
    url_firma: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Firma digital o sello del veterinario'
    }
}, {
    tableName: 'historial_medico',
    timestamps: false
});

Animal.hasMany(HistorialMedico, { foreignKey: 'id_animal' });
HistorialMedico.belongsTo(Animal, { foreignKey: 'id_animal' });

module.exports = HistorialMedico;