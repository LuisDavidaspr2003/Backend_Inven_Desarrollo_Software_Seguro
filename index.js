const express = require('express');
const {getConnection} = require('./db/connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express()
const host= '0.0.0.0'
const port = process.env.PORT;

app.use(cors());

getConnection()

app.use(express.json());

app.use('/usuario', require('./router/usuario'))
app.use('/marca', require('./router/marca'))
app.use('/estadoEquipo', require('./router/estadoEquipo'))
app.use('/tipoEquipo', require('./router/tipoEquipo'))
app.use('/inventario', require('./router/inventario'))
app.use('/auth', require('./router/auth'))






app.listen(port,host, () => {
    console.log(`aplicacion ejecutando en el puerto ${port}`);
})