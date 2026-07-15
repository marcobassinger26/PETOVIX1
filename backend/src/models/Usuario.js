// Archivo: src/models/Usuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Cliente = require('./Cliente');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('Veterinario', 'Tutor', 'Administrador'),
        defaultValue: 'Tutor'
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        references: { model: Cliente, key: 'id_cliente' }
    },
    // ✅ Nuevo campo
    foto_perfil: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

     // 🌟 Campos del directorio público
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    anios_experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

Usuario.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = Usuario;