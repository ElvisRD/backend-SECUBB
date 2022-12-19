const alertaControladores = require('../controllers/alertaControladores');
const express = require('express')
const api = express.Router();

api.post('/alerta', alertaControladores.crearAlerta); 
api.get('/alertas', alertaControladores.obtenerAlertas);
api.delete('/alerta/:id', alertaControladores.eliminarAlerta);
api.post('/alerta/like', alertaControladores.daLikeAlerta);
api.post('/alerta/dislike', alertaControladores.eliminarLike);
api.get('/alertasFiltradas', alertaControladores.obtenerAlertasTipoFecha);

module.exports = api