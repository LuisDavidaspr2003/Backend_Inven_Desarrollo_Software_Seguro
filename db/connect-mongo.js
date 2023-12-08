const moongose = require('mongoose');

const getConnection = async () =>{

    try {

const url = 'mongodb+srv://luisasprilla:wt41Di8dO17wjs71@base.xmzp5n9.mongodb.net/?retryWrites=true&w=majority'


    await moongose.connect(url)
console.log('conexion exitosa')

    
} catch (error) {
    console.log(error)
    
}
    }
    module.exports = {
        getConnection,
}