const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generarCodigoUnico = async () => {
    let codigo = '';
    let existe = true;
    while (existe) {
        const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
        codigo = `PET-${randomStr}`;
        const clienteExistente = await Cliente.findOne({ where: { codigo_tutor: codigo } });
        if (!clienteExistente) existe = false;
    }
    return codigo;
};

// 1. REGISTRO
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol, telefono, direccion } = req.body;

        if (!nombre?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ mensaje: 'El formato del email no es válido.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
        }
        const rolesValidos = ['Tutor', 'Veterinario', 'Administrador'];
        if (rol && !rolesValidos.includes(rol)) {
            return res.status(400).json({ mensaje: 'Rol no válido.' });
        }

        const existente = await Usuario.findOne({ where: { email: email.toLowerCase() } });
        if (existente) {
            return res.status(400).json({ mensaje: 'Ya existe una cuenta con ese email.' });
        }

        let id_cliente = null;
        let codigoGenerado = null;

        if (rol === 'Tutor' || !rol) {
            codigoGenerado = await generarCodigoUnico();
            const nuevoCliente = await Cliente.create({
                nombre_completo: nombre,
                email,
                telefono: telefono || 'Sin registrar',
                direccion: direccion || 'Sin registrar',
                codigo_tutor: codigoGenerado
            });
            id_cliente = nuevoCliente.id_cliente;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        await Usuario.create({
            nombre, email,
            password: passwordEncriptada,
            rol: rol || 'Tutor',
            id_cliente
        });

        res.json({ mensaje: 'Cuenta creada con éxito', codigo_tutor: codigoGenerado });
    } catch (error) {
        console.error("🔴 ERROR EN REGISTRO:", error); // 👈 ¡El megáfono!
        res.status(500).json({ mensaje: error.message });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ mensaje: 'Error de configuración del servidor' });
        }

        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
        }

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });

        let codigoTutor = null;
        if (usuario.id_cliente) {
            const clienteInfo = await Cliente.findByPk(usuario.id_cliente);
            if (clienteInfo) codigoTutor = clienteInfo.codigo_tutor;
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol, id_cliente: usuario.id_cliente },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            mensaje: 'Bienvenido a PETOVIX',
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                id_cliente: usuario.id_cliente,
                codigo_tutor: codigoTutor,
                foto_perfil: usuario.foto_perfil || null
            }
        });
    } catch (error) {
        console.error("🔴 ERROR EN LOGIN:", error); // 👈 ¡El megáfono!
        res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message });
    }
};

// 3. ACTUALIZAR PERFIL
exports.updateProfile = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const { nombre, email, passwordActual, nuevaPassword } = req.body;

        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const esValida = await bcrypt.compare(passwordActual, usuario.password);
        if (!esValida) return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });

        usuario.nombre = nombre || usuario.nombre;
        usuario.email  = email  || usuario.email;

        if (nuevaPassword && nuevaPassword.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(nuevaPassword, salt);
        }

        await usuario.save();
        res.json({ mensaje: '¡Perfil actualizado con éxito! ✅' });
    } catch (error) {
        console.error("🔴 ERROR AL ACTUALIZAR PERFIL:", error); // 👈 ¡El megáfono!
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};