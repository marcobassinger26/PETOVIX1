// Archivo: src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Esto lee tu contraseña del archivo .env

// Configuración de la conexión
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de la base de datos
    process.env.DB_USER,     // Usuario (usualmente 'root')
    process.env.DB_PASS,     // Contraseña
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',    // Estamos usando MySQL
        logging: false       // Para que no llene la consola de texto basura
    }
);

// Probar la conexión
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL exitosa: Base de datos KORIUM conectada.');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
    }
};

module.exports = { sequelize, connectDB };