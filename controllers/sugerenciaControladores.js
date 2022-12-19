const prisma = require('../client');

const crearSugerencia = async(req,res) => {
    const {sugerencia,usuarioId} = req.body;

    await prisma.sugerencia.create({
        data: {
            sugerencia,
            usuario: { connect: {id: usuarioId}},
        
        }
    })

    res.status(201).send({mensaje: "la sugerencia fue creada correctamente"})

}

const obtenerSugerencias = async(req,res) => {
    
    const sugerencias = await prisma.sugerencia.findMany({
        orderBy: {
            id: 'desc'
        },
    });

    if(sugerencias[0] !== undefined){
        return res.status(200).send(sugerencias);
    }else{
        return res.status(404).send({mensaje: "no se encontraron sugerencias"})
    }
}

const eliminarSugerencia = async(req,res) => {
    const {id} = req.params;

    await prisma.sugerencia.delete({
        where: {id: parseInt(id)}
    }) 

    return res.status(200).send({mensaje: "la sugerencia fue eliminada correctamente"})
}

module.exports = {
    crearSugerencia,
    obtenerSugerencias,
    eliminarSugerencia
}