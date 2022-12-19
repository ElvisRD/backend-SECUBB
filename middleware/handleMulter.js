const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        const route = './upload/'+req.params.tipo
        if(!fs.existsSync(route)){
            fs.mkdirSync(route,{recursive: true})
        }
        cb(null,route)
       
    },
    filename: function (req,file,cb){
        let fecha = new Date()
        fecha = fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate()
        const nameFile = req.params.tipo+'_'+req.params.idAlerta+'.jpg'
        cb(null,nameFile)
    }
   
})

const upload = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
       cb(null, true) 
    },
    limits: {
        fileSize: 1024*1024*10
    }
})

module.exports = upload