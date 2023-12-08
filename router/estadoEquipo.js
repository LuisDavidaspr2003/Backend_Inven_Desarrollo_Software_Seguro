const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAdmin } = require('../middleware/validar-rol-admin');



const router = Router();

router.post('/', [validarJWT,validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const existeEstadoEquipo = await EstadoEquipo.findOne({ nombre: req.body.nombre });
        if (existeEstadoEquipo) {
            return res.status(400).send('El estado de equipo ya existe');
        }

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});


router.get('/',[validarJWT,validarRolAdmin], async function(req, res) {
    try {
        const estadosEquipos = await EstadoEquipo.find();
        res.send(estadosEquipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});


router.put('/:estadoEquipoId', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if (!estadoEquipo) {
            return res.status(400).send('Estado de equipo no existe');
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();
        res.send(estadoEquipo);

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al intentar actualizar el estado de equipo');
    }
});

router.delete('/:estadoEquipoId', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        const estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if (!estadoEquipo) {
            return res.status(400).send('Estado de equipo no existe');
        }

        await EstadoEquipo.findByIdAndDelete(req.params.estadoEquipoId);

        res.send('Estado de equipo eliminado correctamente');

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al intentar eliminar el estado de equipo');
    }
});

module.exports = router;
