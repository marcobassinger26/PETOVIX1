// Archivo: src/controllers/animalController.js
const Animal = require('../models/Animal');
const HistorialMedico = require('../models/HistorialMedico');
const Cliente = require('../models/Cliente');
const crypto = require('crypto'); // 👈 1. Importamos crypto para generar los códigos

// 🛠️ 2. HELPER: Generador de códigos únicos (KOR-XXXXXX)
const generarCodigoUnico = async () => {
    let codigo = '';
    let existe = true;
    while (existe) {
        const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
        codigo = `KOR-${randomStr}`;
        const clienteExistente = await Cliente.findOne({ where: { codigo_tutor: codigo } });
        if (!clienteExistente) existe = false;
    }
    return codigo;
};

exports.getPerfilCompleto = async (req, res) => {
    try {
        const { id } = req.params; 
        const animal = await Animal.findByPk(id, {
            include:
            [
                { model: HistorialMedico },
                { model: Cliente } 
            ] 
        });

        if (!animal) {
            return res.status(404).json({ mensaje: 'Mascota no encontrada' });
        }

        res.json(animal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAnimals = async (req, res) => {
    try {
        const { id_cliente } = req.query; 
        let opcionesDeBusqueda = {};

        if (id_cliente) {
            opcionesDeBusqueda.where = { id_cliente: id_cliente };
        }

        const animales = await Animal.findAll(opcionesDeBusqueda);
        res.json(animales); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener animales' });
    }
};

exports.buscarPorMicrochip = async (req, res) => {
    try {
        const { chip } = req.params; 

        console.log("Buscando chip:", chip); 

        const animal = await Animal.findOne({
            where: { numero_microchip: chip }, 
            include: 
            [
                { model: HistorialMedico },
                { model: Cliente } 
            ] 
        });

        if (!animal) {
            return res.status(404).json({ 
                mensaje: 'No existe ninguna mascota con este Microchip',
                chip_buscado: chip
            });
        }

        res.json(animal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor buscando el chip' });
    }
};

exports.agregarEvento = async (req, res) => {
    try {
        const { id } = req.params; 
        const id_usuario = req.usuario?.id; 
        const nuevoEvento = await HistorialMedico.create({
            id_animal: id,
            id_usuario: id_usuario || null, 
            ...req.body 
        });
        res.json(nuevoEvento);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar: " + error.message });
    }
};

// 🌟 3. ACTUALIZADO: Registrar Tutor (Maneja código existente o crea uno nuevo)
exports.registrarTutor = async (req, res) => {
    try {
        const { id } = req.params;
        // 👈 Ahora recibimos codigo_tutor en lugar del ID
        const { codigo_tutor, nombre_completo, telefono, email, direccion } = req.body;

        let id_cliente_final = null;

        // 🟢 ESCENARIO A: El veterinario ingresó un código (Ej. KOR-A1B2C3)
        if (codigo_tutor) {
            const cliente = await Cliente.findOne({ where: { codigo_tutor: codigo_tutor } });
            if (!cliente) {
                return res.status(404).json({ mensaje: 'No se encontró ningún tutor con ese código.' });
            }
            id_cliente_final = cliente.id_cliente; // Rescatamos el ID interno
        } 
        // 🔵 ESCENARIO B: El veterinario registró un cliente desde cero en el modal
        else if (nombre_completo) {
            const nuevoCodigo = await generarCodigoUnico(); // Le generamos su código
            const nuevoCliente = await Cliente.create({
                nombre_completo,
                telefono: telefono || 'Sin registrar',
                email: email || null,
                direccion: direccion || 'Sin registrar',
                codigo_tutor: nuevoCodigo // Lo guardamos
            });
            id_cliente_final = nuevoCliente.id_cliente;
        } 
        // 🔴 ESCENARIO C: Formulario vacío
        else {
            return res.status(400).json({ mensaje: 'Faltan datos para asignar al tutor.' });
        }

        // Buscamos a la mascota y le pegamos el ID interno del tutor
        const animal = await Animal.findByPk(id);
        if (animal) {
            animal.id_cliente = id_cliente_final;
            await animal.save();
        }

        res.json({ mensaje: '¡Tutor asignado con éxito a la mascota!' });
    } catch (error) {
        res.status(500).json({ error: 'Error registrando tutor: ' + error.message });
    }
};

exports.vincularMascota = async (req, res) => {
    try {
        const { chip, id_cliente } = req.body;
        const animal = await Animal.findOne({ where: { numero_microchip: chip } });

        if (!animal) return res.status(404).json({ mensaje: 'No existe ninguna mascota con ese Chip.' });

        if (animal.id_cliente !== null) {
            if (animal.id_cliente == id_cliente) return res.status(400).json({ mensaje: '¡Ya tienes registrada a esta mascota!' });
            return res.status(403).json({ mensaje: 'Esta mascota ya pertenece a otro usuario. Contacta a soporte.' });
        }

        animal.id_cliente = id_cliente;
        await animal.save();
        res.json({ mensaje: `¡Éxito! ${animal.nombre} ahora está vinculado a tu cuenta.` });
    } catch (error) {
        res.status(500).json({ error: 'Error vinculando mascota: ' + error.message });
    }
};

exports.crearAnimal = async (req, res) => {
    try {
        const { nombre, especie, raza, sexo, fecha_nacimiento, numero_microchip, estado, alergias } = req.body;
        const existeChip = await Animal.findOne({ where: { numero_microchip } });
        if (existeChip) return res.status(400).json({ mensaje: 'Ya existe una mascota con ese Microchip registrado.' });

        const nuevaMascota = await Animal.create({
            nombre, especie, raza, sexo,
            fecha_nacimiento: fecha_nacimiento || null,
            numero_microchip, estado: estado || 'Disponible', alergias
        });

        res.status(201).json(nuevaMascota);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarAnimal = async (req, res) => {
    try {
        const { id } = req.params; 
        const { estado, alergias } = req.body; 

        const animal = await Animal.findByPk(id);
        if (!animal) return res.status(404).json({ mensaje: 'No se encontró la mascota en el sistema.' });

        await animal.update({ 
            estado: estado || animal.estado, 
            alergias: alergias !== undefined ? alergias : animal.alergias 
        });

        res.json({ mensaje: 'Datos actualizados con éxito', animal });
    } catch (error) {
        console.error("Error en actualizarAnimal:", error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
};

exports.actualizarTutor = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const { nombre_completo, telefono, email, direccion } = req.body;

        const cliente = await Cliente.findByPk(id_cliente);
        if (!cliente) return res.status(404).json({ mensaje: 'No se encontró el tutor' });

        await cliente.update({ nombre_completo, telefono, email, direccion });
        res.json({ mensaje: 'Datos del tutor actualizados', cliente });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.vincularPorChip = async (req, res) => {
    try {
        const { numero_microchip } = req.body;
        const id_cliente = req.usuario.id_cliente; 

        if (!id_cliente) return res.status(400).json({ mensaje: "Tu usuario no tiene un perfil de cliente asociado." });

        const mascota = await Animal.findOne({ where: { numero_microchip } });
        if (!mascota) return res.status(404).json({ mensaje: "No se encontró ninguna mascota con ese número de chip." });

        if (mascota.id_cliente && mascota.id_cliente !== id_cliente) {
            return res.status(403).json({ mensaje: "Esta mascota ya está vinculada a otro tutor." });
        }

        await mascota.update({ id_cliente: id_cliente });
        res.json({ mensaje: "¡Mascota vinculada con éxito! Ya puedes ver su carnet.", mascota });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMisPacientes = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const animales = await Animal.findAll({
            include: [{
                model: HistorialMedico,
                where: { id_usuario: id_usuario },
                required: true
            }]
        });

        const unicos = Object.values(
            animales.reduce((acc, a) => {
                acc[a.id_animal] = a;
                return acc;
            }, {})
        );

        res.json(unicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};