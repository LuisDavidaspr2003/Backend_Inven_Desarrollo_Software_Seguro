const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAdmin } = require('../middleware/validar-rol-admin');



const router = Router();

router.post('/', [validarJWT,validarRolAdmin] , [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const existeTipoEquipo = await TipoEquipo.findOne({ nombre: req.body.nombre });
        if (existeTipoEquipo) {
            return res.status(400).send('El tipo de equipo ya existe');
        }

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save()

        res.send(tipoEquipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});

router.get('/', [validarJWT,validarRolAdmin] , async function(req, res) {
    try {
        const tiposEquipos = await TipoEquipo.find();
        res.send(tiposEquipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});

router.put('/:tipoEquipoId', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if (!tipoEquipo) {
            return res.status(400).send('Tipo de equipo no existe');
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});


router.delete('/:tipoEquipoId', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        const tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if (!tipoEquipo) {
            return res.status(400).send('Tipo de equipo no existe');
        }

        await TipoEquipo.findByIdAndDelete(req.params.tipoEquipoId);

        res.send('Tipo de equipo eliminado correctamente');

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al intentar eliminar el tipo de equipo');
    }
});



module.exports = router;
