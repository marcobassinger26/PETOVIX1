// Archivo: src/models/Cliente.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true
    },
    direccion: {
        type: DataTypes.STRING(255)
    },
    // 🌟 NUEVA COLUMNA: El código público del tutor
    codigo_tutor: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true // Permitimos nulos para no romper los clientes que ya tenías guardados
    },
    fecha_registro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'clientes', // Nombre de tu tabla en MySQL
    timestamps: false
});

module.exports = Cliente;