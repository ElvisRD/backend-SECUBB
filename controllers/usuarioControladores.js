const prisma = require('../client');

const existeUsuario = async (req, res) => {
    const {correo, contraseña} = req.body;

    const cuentas = [{
        id: 1,
        correo: "Elvis@gmail.com",
        contraseña: "1234",
        tipo: "Estudiante",
        notificaciones: true
        },{
        id: 2,
        correo: "Pablo@gmail.com",
        contraseña: "1234",
        tipo: "Administrador",
        notificaciones: true
        }
    ]

    const cuenta = cuentas.find(cuenta => cuenta.correo === correo && cuenta.contraseña === contraseña);

    if(cuenta !== undefined){
        return res.status(200).send({mensaje: "usuario encontrado", usuario: cuenta});
    }else{
        return res.status(404).send({mensaje: "usuario no encontrado"});
    }

}




module.exports = {
    existeUsuario
}