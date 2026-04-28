// src/models/Cita.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Animal = require('./Animal');
const Usuario = require('./Usuario');

const Cita = sequelize.define('Cita', {
    id_cita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_animal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Veterinario asignado'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Completada', 'Cancelada'),
        defaultValue: 'Pendiente'
    },
    notas: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'citas',
    timestamps: false
});

// Relaciones
Animal.hasMany(Cita, { foreignKey: 'id_animal' });
Cita.belongsTo(Animal, { foreignKey: 'id_animal' });

Usuario.hasMany(Cita, { foreignKey: 'id_usuario' });
Cita.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Cita;