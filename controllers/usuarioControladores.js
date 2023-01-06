const prisma = require('../client');
const bcrypt = require('bcrypt');
const generator = require('generate-password');

const correos = require('./emailsControladores');

const verificarUsuario = async (req, res) => {
    const {correo, contrasena} = req.body;

    let correoLowercase = correo.toLowerCase();

    if(correo.includes("@ubiobio.cl") || correo.includes("@alumnos.ubiobio.cl")){

        const cuenta = await prisma.usuario.findFirst({
            where: {
                correo: correoLowercase,
            }
        })
        
        if(cuenta !== null){
            const comparacion = await bcrypt.compare(contrasena, cuenta.contrasena);
            if(!comparacion) return res.status(400).send({mensaje: "contraseña incorrecta"});
            return res.status(200).send({mensaje: "usuario encontrado", usuario: cuenta});
        }else{
            return res.status(404).send({mensaje: "el correo ingresado no tiene una cuenta asociada"});
        }
    }else{
        return res.status(401).send({mensaje: "el correo ingresado no le pertenece a la universidad"});
    }

}

const crearUsuario = async (req, res) => {
    const {correo,tipo, nombre, apellido} = req.body;

    const correoModificado = correo.toLowerCase();

    const cuenta = await prisma.usuario.findFirst({
        where: {
            correo: correoModificado
        }
    })
   
    if(cuenta !== null){
        return res.status(406).send({mensaje: "el correo ingresado ya tiene una cuenta asociada"});
    }else{

        let contrasena = generator.generate({
            length: 6,
            numbers: true,
            uppercase: true,
            lowercase: true,

        })

        let contrasenaEncryptada = await bcrypt.hash(contrasena, 10);

        if(correo.includes("@ubiobio.cl") || correo.includes("@alumnos.ubiobio.cl")){
            await prisma.usuario.create({
                data: {
                    correo: correoModificado,
                    contrasena: contrasenaEncryptada,
                    nombre: nombre,
                    apellido: apellido,
                    tipo: tipo,
                    notificaciones: true
                }
            })

            correos.enviarCorreo(correo, contrasena, "registro");

            return res.status(201).send({mensaje: "usuario creado correctamente"});
        }else{
            return res.status(400).send({mensaje: "el correo ingresado no corresponde a la universidad"});
        }
    }

}

const editarNotificaciones = async (req, res) => {
    const {id, notificaciones} = req.body;

    const usuarioExiste = await prisma.usuario.findFirst({
        where: {id: parseInt(id)}
    })

    if(!usuarioExiste) return res.status(404).send({mensaje: "el usuario no existe"});

    await prisma.usuario.update({
        where: {id: parseInt(id)},
        data: {notificaciones: notificaciones}
    })

    return res.status(201).send({mensaje: "el usuario fue editado correctamente"});
}

const recuperarContrasena = async (req, res) => {
    const {correo} = req.body;

    if(correo.includes("@ubiobio.cl") || correo.includes("@alumnos.ubiobio.cl")){
        let correoModifcado = correo.toLowerCase();
  
        const cuenta = await prisma.usuario.findFirst({
            where: {
                correo: correoModifcado
            }
        })

        if(cuenta !== null){
            let contrasena = generator.generate({
                length: 6,
                numbers: true,
                uppercase: true,
                lowercase: true,
            })

            correos.enviarCorreo(correoModifcado, contrasena, "recuperarContra");
            let contrasenaEncryptada = await bcrypt.hash(contrasena, 10);

            await prisma.usuario.update({
                where: {id: cuenta.id},
                data: {contrasena: contrasenaEncryptada}
            })

            return res.status(200).send({mensaje: "se ha enviado un correo con la nueva contraseña"});
        }else{
            return res.status(404).send({mensaje: "el correo ingresado no tiene una cuenta asociada"});
        }
    }else{
        return res.status(400).send({mensaje: "el correo ingresado no corresponde a la universidad"});
    }
}

const modificarContrasena = async (req, res) => {
    const {id, contrasenaNueva, contrasenaActual} = req.body;

    const usuarioExiste = await prisma.usuario.findFirst({
        where: {id: parseInt(id)}
    })


    const comparacion = await bcrypt.compare(contrasenaActual, usuarioExiste.contrasena);

    if(comparacion){
        let contrasenaEncryptada = await bcrypt.hash(contrasenaNueva, 10);
        await prisma.usuario.update({
            where: {id: parseInt(id)},
            data: {contrasena: contrasenaEncryptada}
        })
        return res.status(201).send({mensaje: "la contraseña fue cambiada correctamente"});
    }else{
        return res.status(400).send({mensaje: "la contraseña actual no es correcta"});
    }
}

const modificarTipoUsuario = async (req, res) => {
    const {correo, tipo} = req.body;

    const usuarioExiste = await prisma.usuario.findFirst({
        where: {correo: correo}
    })

    if(!usuarioExiste) return res.status(404).send({mensaje: "el usuario no existe"});

    if(tipo === usuarioExiste.tipo){
        return res.status(400).send({mensaje: "el usuario ya tiene ese tipo"});
    }else{
        await prisma.usuario.update({
            where: {id: usuarioExiste.id},
            data: {tipo: tipo}
        })
        return res.status(201).send({mensaje: "el tipo de usuario fue cambiado correctamente"});
    }
}

module.exports = {
    verificarUsuario,
    crearUsuario,
    editarNotificaciones,
    recuperarContrasena,
    modificarContrasena,
    modificarTipoUsuario
}