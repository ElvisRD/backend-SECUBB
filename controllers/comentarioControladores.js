const prisma = require('../client');

const crearComentario = async(req,res) => {
    const {comentario,alertaId,usuarioId} = req.body;

    const nDate = new Date().toLocaleString('es-CL', {
        timeZone: 'America/Santiago'
    });

    const fechaYHora = nDate.split(" ");
    const fechaDividida = fechaYHora[0].split("-");
    const fecha = fechaDividida[2].slice(0,4)+'-'+fechaDividida[1]+'-'+fechaDividida[0]+ "T" + fechaYHora[1]+'.000Z'
    const nuevaFecha = new Date(fecha);

    const nuevoComentario = await prisma.comentario.create({
        data: {
            comentario,
            fecha: nuevaFecha,
            usuario: { connect: {id: usuarioId}},
            alerta: {connect: {id: alertaId}},
        },
        include: { daLikeComentario: true, usuario: true}
    })

    res.status(201).send({mensaje: "el comentario fue creado correctamente", nuevoComentario: nuevoComentario})

}

const obtenerComentarios = async(req,res) => {

    const comentarios = await prisma.comentario.findMany({
        include: {usuario: true, daLikeComentario: true}
    })
    
    if(comentarios.length === 0){
        return res.status(404).send({mensaje: "no se encontraron comentarios"})
    }else{
        return res.status(200).send(comentarios)
    }
}

const editarComentario = async(req,res) => {
    const {id,comentario} = req.body;

    const comentarioExiste = await prisma.comentario.findFirst({
        where: {id: parseInt(id)}
    });

    if(!comentarioExiste) return res.status(404).send({mensaje: "el comentario no existe"});

    if(comentario === comentarioExiste.comentario) return res.status(400).send({mensaje: "el comentario es el mismo"})

    await prisma.comentario.update({
        where: {id: parseInt(id)},
        data: {comentario: comentario},
        include: {usuario: true, daLikeComentario: true}
    }) 

    return res.status(201).send({mensaje: "el comentario fue editado correctamente"})

}

const daLikeComentario = async(req,res) => {
    const {comentarioId,usuarioId} = req.body;

    const isLiked = await prisma.daLikeComentario.findFirst({
        where: {
            comentarioId: comentarioId,
            usuarioId: usuarioId
        }
    });

    if(isLiked) return res.status(400).send({mensaje: "ya le diste like a este comentario"})

    await prisma.daLikeComentario.create({
        data: {
            usuario: {connect: {id: usuarioId}},
            comentario: {connect: {id: comentarioId}}
        }
    });

    return res.status(201).send({mensaje: "el like fue creado correctamente"})
}

const eliminarLike = async(req,res) => {
    const {comentarioId,usuarioId} = req.body;

    const isLiked = await prisma.daLikeComentario.findFirst({
        where: { comentarioId: comentarioId, usuarioId: usuarioId}
    });

    if (!isLiked) return res.status(400).send({mensaje: "no le diste like a este comentario"})

    await prisma.daLikeComentario.delete({
        where: {
            usuarioId_comentarioId: {
                comentarioId: comentarioId,
                usuarioId: usuarioId
            }
        }
    }); 

    return res.status(201).send({mensaje: "el like fue eliminado correctamente"})
}


module.exports = {
    crearComentario,
    obtenerComentarios,
    editarComentario,
    daLikeComentario,
    eliminarLike

}