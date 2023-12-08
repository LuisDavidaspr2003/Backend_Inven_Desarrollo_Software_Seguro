const { Router } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');


const router = Router();



router.post('/',  [validarJWT,validarRolAdmin] ,[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),



 ], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'Email ya existe' });
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync()
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un Error');
    }
});

router.get('/',[validarJWT,validarRolAdmin] , async function(req, res){
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un Error');
    }
});

router.put('/:usuarioId', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        if (req.body.password) {
            const salt = bcrypt.genSaltSync();
            const password = bcrypt.hashSync(req.body.password, salt);
            usuario.password = password;
        }

        usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al intentar actualizar el usuario');
    }
});

// DELETE endpoint for deleting Usuario by ID
router.delete('/:usuarioId', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        const usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }

        await Usuario.findByIdAndDelete(req.params.usuarioId);

        res.send('Usuario eliminado correctamente');

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al intentar eliminar el usuario');
    }
});

module.exports = router;
