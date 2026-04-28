// Archivo: src/models/Animal.js (ACTUALIZADO)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Cliente = require('./Cliente'); // 👈 1. Importamos el modelo Cliente

const Animal = sequelize.define('Animal', {
    id_animal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 👇 2. Agregamos el campo para conectar con el dueño
    id_cliente: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'id_cliente'
        }
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    numero_microchip: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    raza: {
        type: DataTypes.STRING(50)
    },
    sexo: {
        type: DataTypes.ENUM('Macho', 'Hembra')
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY
    },
    alergias: {
        type: DataTypes.TEXT
    },
    url_foto: {
        type: DataTypes.STRING(255)
    },
    estado: {
        type: DataTypes.ENUM('Disponible', 'Vendido', 'Cuarentena', 'Adoptado'),
        defaultValue: 'Disponible'
    }
}, {
    tableName: 'animales',
    timestamps: false
});

// 👇 3. Definimos la relación oficial
// "Un Cliente tiene muchos Animales"
Cliente.hasMany(Animal, { foreignKey: 'id_cliente' });
// "Un Animal pertenece a un Cliente"
Animal.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = Animal;