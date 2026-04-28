const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); // 👈 Importamos la librería nativa para generar códigos

// 🛠️ NUEVA FUNCIÓN: Generador de códigos únicos (Ej. PET-A1B2C3)
const generarCodigoUnico = async () => {
    let codigo = '';
    let existe = true;
    
    while (existe) {
        // Genera 3 bytes aleatorios (6 caracteres hexadecimales) y los pasa a mayúsculas
        const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase(); 
        codigo = `PET-${randomStr}`; // 👈 Actualizado al nuevo nombre PETOVIX
        
        // Verificamos en la base de datos que no se haya generado este código antes
        const clienteExistente = await Cliente.findOne({ where: { codigo_tutor: codigo } });
        if (!clienteExistente) {
            existe = false; // El código está libre
        }
    }
    return codigo;
};

// 1. REGISTRO
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol, telefono, direccion } = req.body; 

        let id_cliente = null;
        let codigoGenerado = null; 

        // Si el rol es Tutor (o viene vacío, que por defecto es Tutor)
        if (rol === 'Tutor' || !rol) {
            codigoGenerado = await generarCodigoUnico(); // 👈 Generamos el código PET-XXXXXX

            const nuevoCliente = await Cliente.create({
                nombre_completo: nombre,
                email: email,
                telefono: telefono || 'Sin registrar', 
                direccion: direccion || 'Sin registrar',
                codigo_tutor: codigoGenerado // 👈 Lo guardamos en la tabla clientes
            });
            id_cliente = nuevoCliente.id_cliente;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        await Usuario.create({
            nombre,
            email,
            password: passwordEncriptada,
            rol: rol || 'Tutor',
            id_cliente
        });

        res.json({ 
            mensaje: 'Cuenta creada con éxito',
            codigo_tutor: codigoGenerado 
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });

        // 🌟 NUEVO: Búsqueda del código de tutor para mandarlo a React
        let codigoTutor = null;
        if (usuario.id_cliente) {
            const clienteInfo = await Cliente.findByPk(usuario.id_cliente);
            if (clienteInfo) {
                codigoTutor = clienteInfo.codigo_tutor;
            }
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol, id_cliente: usuario.id_cliente }, 
            process.env.JWT_SECRET || 'secreto_super_seguro', 
            { expiresIn: '12h' }
        );

        res.json({ 
            mensaje: 'Bienvenido a PETOVIX', // 👈 Actualizado al nuevo nombre
            token, 
            usuario: { 
                id: usuario.id_usuario, 
                nombre: usuario.nombre, 
                rol: usuario.rol, 
                id_cliente: usuario.id_cliente,
                codigo_tutor: codigoTutor // 👈 AQUÍ VIAJA EL CÓDIGO A TU PERFIL DE REACT
            }
        });
    } catch (error) {
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
        usuario.email = email || usuario.email;

        if (nuevaPassword && nuevaPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(nuevaPassword, salt);
        }

        await usuario.save();
        res.json({ mensaje: '¡Perfil actualizado con éxito! ✅' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};