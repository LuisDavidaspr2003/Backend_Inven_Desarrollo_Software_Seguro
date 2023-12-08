const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAdmin } = require('../middleware/validar-rol-admin');



const router = Router();

router.post('/',  [validarJWT,validarRolAdmin] , [
    check('Serial', 'invalid.Serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descrpcion', 'invalid.descrpcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').isISO8601(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').optional().isMongoId(),
    check('marca', 'invalid.marca').optional().isMongoId(),
    check('estadoEquipo', 'invalid.estadoEquipo').optional().isMongoId(),
    check('tipoEquipo', 'invalid.tipoEquipo').optional().isMongoId(),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const existeInventario = await Inventario.findOne({ Serial: req.body.Serial });
        if (existeInventario) {
            return res.status(400).send('El inventario ya existe');
        }

        let inventario = new Inventario();
        inventario.Serial = req.body.Serial;
        inventario.modelo = req.body.modelo;
        inventario.descrpcion = req.body.descrpcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = new Date(req.body.fechaCompra);
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});

router.get('/', [validarJWT] , async function(req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            {
                path:'usuario', select: 'nombre email estado'
            },
            {
                path:'marca', select: 'nombre estado'
            },
            {
                path:'estadoEquipo', select: 'nombre estado'
            },
            {
                
                path:'tipoEquipo', select: 'nombre estado'

            }


        ]);
        res.send(inventarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});

router.put('/:inventarioId', [validarJWT, validarRolAdmin], [
    check('Serial', 'invalid.Serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descrpcion', 'invalid.descrpcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').isISO8601(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').optional().isMongoId(),
    check('marca', 'invalid.marca').optional().isMongoId(),
    check('estadoEquipo', 'invalid.estadoEquipo').optional().isMongoId(),
    check('tipoEquipo', 'invalid.tipoEquipo').optional().isMongoId(),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(400).send('Inventario no existe');
        }

        inventario.Serial = req.body.Serial;
        inventario.modelo = req.body.modelo;
        inventario.descrpcion = req.body.descrpcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = new Date(req.body.fechaCompra);
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al intentar actualizar el inventario');
    }
});

router.delete('/:inventarioId', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        const inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(400).send('Inventario no existe');
        }

        await Inventario.findByIdAndDelete(req.params.inventarioId);

        res.send('Inventario eliminado correctamente');

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al intentar eliminar el inventario');
    }
});


module.exports = router;
