const comentarioControladores = require('../controllers/comentarioControladores');
const express = require('express')
const api = express.Router();

api.post('/comentario', comentarioControladores.crearComentario); 
api.get('/comentarios', comentarioControladores.obtenerComentarios);
api.put('/comentario/editar', comentarioControladores.editarComentario);
api.post('/comentario/like', comentarioControladores.daLikeComentario);
api.post('/comentario/dislike', comentarioControladores.eliminarLike);

module.exports = api