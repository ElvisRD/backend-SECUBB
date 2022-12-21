const express = require('express');
const cors = require('cors');
const {Server} = require("socket.io");
const http = require("http") 
const path = require('path');

const alertaControladores = require('./controllers/alertaControladores');

const usuarioRutas = require('./routes/usuarioRutas');
const alertaRutas = require('./routes/alertaRutas');
const comentarioRutas = require('./routes/comentariosRutas');
const sugerenciaRutas = require('./routes/sugerenciaRutas');
const imagenRutas = require('./routes/imagenRutas');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.options('*', cors())
app.use(express.json())
app.use('/api', usuarioRutas)
app.use('/api', alertaRutas)
app.use('/api', comentarioRutas)
app.use('/api', sugerenciaRutas) 
app.use('/api', imagenRutas)
app.use('/upload', express.static(path.join(__dirname, '/upload')));


io.on('connection', (socket) => {

    console.log("usuario conectado: "+socket.id);

    socket.on("alerta", (alert) => {
        socket.broadcast.emit("alerta", alert);
        socket.broadcast.emit("notificacion", alert);
        
        setTimeout(() => {    
            alertaControladores.editarAlerta(alert.id).then((alerta) => {
                socket.broadcast.emit("eliminarAlerta", alerta);
                socket.emit("eliminarAlerta", alerta);
            }).catch((error) => {
                console.log("no se pudo editar la alerta");
                //console.log(error);
            })
        }, 60000);

    }) 

    socket.on("comentario", (comentario) => {
        console.log(comentario);
        socket.broadcast.emit("comentario", comentario);
    }) 

    socket.on("daLikeAlerta", (like) =>{
        socket.broadcast.emit("daLikeAlerta", like);
    })

    socket.on("daDislikeAlerta", (dislike, position) =>{ 
        socket.broadcast.emit("daDislikeAlerta", dislike, position);
    }) 
    
    socket.on("daLikeComentario", (like) =>{
        socket.broadcast.emit("daLikeComentario", like);
    })

    socket.on("daDislikeComentario", (dislike,position) =>{
        socket.broadcast.emit("daDislikeComentario", dislike, position);
    })

    socket.on("eliminarAlerta", (alerta) => {
        socket.broadcast.emit("eliminarAlerta", alerta);
    })

    socket.on("editarComentario", (comentario) => {
        socket.broadcast.emit("editarComentario", comentario);
    })

    socket.on("guardarSugerencia", (sugerencia) => {
        socket.broadcast.emit("guardarSugerencia", sugerencia);
    })

    socket.on("eliminarSugerencia", (sugerencia) => {
        socket.broadcast.emit("eliminarSugerencia", sugerencia);
    })

})

const PORT = process.env.PORT || 3002;


server.listen(PORT,  () => {
    console.log("server corriendo en el puerto "+PORT)
})


