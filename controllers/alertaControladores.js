const prisma = require('../client');
const fs = require("fs");


const crearAlerta = async (req, res) => {
    const {tipo,descripcion,ubicacion,descripcion_ubicacion, longitude, latitude ,usuarioId} = req.body;

    const nDate = new Date().toLocaleString('es-CL', {
        timeZone: 'America/Santiago'
    });

    const fechaYHora = nDate.split(" ");
    const fechaDividida = fechaYHora[0].split("-");
    const fecha = fechaDividida[2].slice(0,4)+'-'+fechaDividida[1]+'-'+fechaDividida[0]+ "T" + fechaYHora[1]+'.000Z'
    const nuevaFecha = new Date(fecha);

    const alerta = await prisma.alerta.create({
        data: {
            tipo: tipo,
            descripcion: descripcion,
            ubicacion: ubicacion,
            descripcion_ubicacion: descripcion_ubicacion,
            longitude: longitude,
            fecha: nuevaFecha,
            latitude: latitude,
            activa: true,
            usuario: {connect: {id: usuarioId}},
        },
        include: {usuario: true, daLikeAlerta: true, comentarios: true}
    })   


    return res.status(201).send({mensaje: "la alerta fue creada correctamente", alerta: alerta})

}

const eliminarAlerta = async (req,res) => {
    const {id} = req.params;

    const alerta = await prisma.alerta.findFirst({
        where: {id: parseInt(id)},
        include: {comentarios: true , daLikeAlerta: true,imagen: true}

    })

    if(!alerta) return res.status(404).send({mensaje: "no se encontro alerta"});

    if(alerta.imagen !== null){
        const image = await prisma.imagen.findFirst({
            where: {alertaId: {equals: parseInt(id)}}
        })
        const urlModificada = image.url.replace(/\\/g, "/");
        try{
            fs.unlinkSync('./'+urlModificada);
        }catch(err){
           console.log("la imagen no existe");
        }
    }

    
    if(alerta.comentarios[0] !== undefined){
        alerta.comentarios.map(async (comentario) => {
            await prisma.daLikeComentario.deleteMany({
                where: {comentarioId: comentario.id}
            })
        })

        await prisma.comentario.deleteMany({
            where: {alertaId: parseInt(id)}
        })
    }

    if(alerta.daLikeAlerta[0] !== undefined){
        await prisma.daLikeAlerta.deleteMany({
            where: {alertaId: parseInt(id)}
        })
    }  
 
    await prisma.alerta.delete({
        where: {id: parseInt(id)}
    })  

    return res.status(201).send({mensaje: "la alerta fue eliminada correctamente"})
}


const obtenerAlertas = async (req,res) => {
   
    let alertas = [];
       
        alertas = await prisma.alerta.findMany({
            orderBy: {
                id: 'desc'
            },
             where: {activa: true},
            include: {usuario: true, comentarios: true , daLikeAlerta: true}

        })   
        
       if(alertas.length === 0){
           return res.status(404).send({mensaje: "no se encontraron alertas"})
       }else{
           return res.status(200).send(alertas)
       }
}

const obtenerAlertasTipoFecha = async (req,res) => {
    const {tipo, fechaInicial, fechaFinal} = req.query;

    const fechaIniciarDate = new Date(fechaInicial);
    const fechaFinalDate = new Date(fechaFinal)

    const alertas = await prisma.alerta.findMany({
        where: {tipo: tipo, fecha: { gte: fechaIniciarDate, lte: fechaFinalDate}},
        include: {comentarios: true , daLikeAlerta: true}
    }) 

    if(alertas.length === 0){
        return res.status(404).send({mensaje: "no se encontraron alertas"})
    }else{
        return res.status(200).send(alertas)
    } 
}

const daLikeAlerta = async (req,res) => {
    const {alertaId,usuarioId} = req.body;

    const isLiked = await prisma.daLikeAlerta.findFirst({
        where: { alertaId: parseInt(alertaId), usuarioId: parseInt(usuarioId)}
    });

    if(isLiked) return res.status(400).send({mensaje: "ya le diste like a esta alerta"});

    await prisma.daLikeAlerta.create({
        data: {
            usuario: {connect: {id: usuarioId}},
            alerta: {connect: {id: alertaId}}
        }
    });

    return res.status(201).send({mensaje: "el like fue creado correctamente"});
}

const eliminarLike = async (req,res) => {
    const {alertaId,usuarioId} = req.body;

    const isLiked = await prisma.daLikeAlerta.findFirst({
        where: { alertaId: parseInt(alertaId), usuarioId: parseInt(usuarioId)}
    })

    if(!isLiked) return res.status(400).send({mensaje: "no le diste like a esta alerta"});

    await prisma.daLikeAlerta.delete({
        where: { 
            usuarioId_alertaId: {
                alertaId: parseInt(alertaId),
                usuarioId: parseInt(usuarioId)
            }
        }
    });

    return res.status(201).send({mensaje: "el like fue eliminado correctamente"})
}

const editarAlerta = async (id) => {
    const alerta = await prisma.alerta.findFirst({
        where: {id: parseInt(id)},
    })

    if(!alerta) return res.status(404).send({mensaje: "no se encontro la alerta"});

    const alertaEditada = await prisma.alerta.update({
        where: {id: parseInt(id)},
        data: {
            activa: false
        },
        include: {usuario: true, comentarios: true, daLikeAlerta: true}
    })
    

    return alertaEditada
}

module.exports = {
    crearAlerta,
    eliminarAlerta,
    editarAlerta,
    obtenerAlertas,
    obtenerAlertasTipoFecha,
    eliminarLike,
    daLikeAlerta
}