const { Router } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { generarJWT} = require ('../helpers/jwt')

const router = Router()


router.post('/', [
    check('password', 'invalid.password').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),






], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'user not found' });

        }
        const esIgual = await bcrypt.compareSync(req.body.password, usuario.password );
        if (esIgual) {
            return res.status(400).json({ mensaje: 'user not found' });

        }


        const token = generarJWT(usuario)

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email,acces_token: token


        });

    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: 'Internal server error'});

    }

    })

module.exports = router;