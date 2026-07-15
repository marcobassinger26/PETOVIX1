// Pega esto cerca del inicio de tu server.js / index.js, antes de las rutas
const fs = require('fs');
['uploads/fotos', 'uploads/radiografias', 'uploads/perfiles'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
// Archivo: index.js
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
require('dotenv').config();



const animalRoutes = require('./src/routes/animalRoutes');
const citaRoutes = require('./src/routes/citaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS: en producción solo acepta el dominio del frontend ──────
const origenesPermitidos = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        // Permite peticiones sin origin (Postman, apps móviles) solo en desarrollo
        if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
        if (origenesPermitidos.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origen no permitido → ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ── Headers de seguridad básicos ────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('X-Powered-By'); // Oculta que usas Express
    next();
});

// ── Límite de tamaño en JSON (evita ataques de payload grande) ───
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api/clientes', require('./src/routes/clienteRoutes'));

connectDB();

app.use('/api/animales', animalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/citas', citaRoutes);

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
    res.send('API PETOVIX: Sistema Médico Veterinario 🐾');
});

// ── Manejador global de errores ──────────────────────────────────
app.use((err, req, res, next) => {
    // Errores de CORS
    if (err.message?.startsWith('CORS:')) {
        return res.status(403).json({ mensaje: err.message });
    }
    console.error('Error no controlado:', err.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor PETOVIX corriendo en http://localhost:${PORT}`);
    if (!process.env.JWT_SECRET) {
        console.error('⚠️  ADVERTENCIA: JWT_SECRET no está definido en .env — la API no funcionará correctamente.');
    }
});

