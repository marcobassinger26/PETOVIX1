// Archivo: index.js
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
require('dotenv').config();

const animalRoutes = require('./src/routes/animalRoutes');
const citaRoutes = require('./src/routes/citaRoutes'); // 👈 AGREGA ESTO


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/clientes', require('./src/routes/clienteRoutes'));

connectDB();

app.use('/api/animales', animalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/citas', citaRoutes); // 👈 Y ESTO


// Importamos las nuevas rutas de usuarios
const usuarioRoutes = require('./src/routes/usuarioRoutes');

// Le decimos a Express que las use bajo el prefijo /api/usuarios
app.use('/api/usuarios', usuarioRoutes);


app.get('/', (req, res) => {
    res.send('API KORIUM: Sistema Médico en Línea 🏥');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});