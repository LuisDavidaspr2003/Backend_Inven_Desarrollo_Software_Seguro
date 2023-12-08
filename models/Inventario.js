const { Schema, model} = require('mongoose')

const Inventariochema = Schema({
Serial:{type: String, required:true , unique: true},    
modelo: {type: String, required:true},
descrpcion: {type: String, required:true},
color: {type: String, required:true},
foto: {type: String, required:true},
fechaCompra:{type: Date, required:true},
precio: {type: String, required:true},
usuario:{type: Schema.Types.ObjectId,ref:'Usuario',required: false},
marca:{type: Schema.Types.ObjectId,ref:'Marca',required: false},
estadoEquipo:{type: Schema.Types.ObjectId,ref:'EstadoEquipo',required: false},
tipoEquipo:{type: Schema.Types.ObjectId,ref:'TipoEquipo',required: false},
fechaCreacion:{type: Date, required:true},
fechaActualizacion:{type: Date, required:true},


});
module.exports = model('Inventario',Inventariochema)