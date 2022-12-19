const prisma = require('../client');

const guardarImagen = async(req,res) => {
      const {idAlerta} = req.params;
      
      if(!req.file){
        return res.status(404).send({mensaje: "Archivo no encontrado"})
      }else{
        await prisma.imagen.create({
          data: {
            url: req.file.path,
            alerta: { connect: {id: parseInt(idAlerta, 10)}}
          }
        }) 
    
      return res.status(201).send({mensaje: "Imagen guardada correctamente"})
      }

}

const obtenerImagen = async(req,res) => {
    const {idAlerta} = req.params;

    const imagen = await prisma.imagen.findFirst({
      where: {alertaId: parseInt(idAlerta, 10)}
      }   
    )

    if(!imagen){
      return res.status(404).send({mensaje: "No se encontró la imagen"})
    }else{
      return res.status(200).send(imagen)
    }

}


module.exports = {
    guardarImagen,
    obtenerImagen
}