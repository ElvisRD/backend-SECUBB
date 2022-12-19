const fileSizeError = (err, req, res, next) => {
    if(err){
        return res.status(413).send({mensaje: "El archivo es demasiado grande"})
    }else{
        next()
    }
}

module.exports = fileSizeError