
const usuarioControladores = require('../controllers/usuarioControladores');
const express = require('express')
const api = express.Router();

api.post('/verificarUsuario', usuarioControladores.verificarUsuario);
api.post('/crearUsuario', usuarioControladores.crearUsuario);
api.put('/editarNotificaciones', usuarioControladores.editarNotificaciones);
api.post('/recuperarContrasena', usuarioControladores.recuperarContrasena);
api.put('/modificarContrasena', usuarioControladores.modificarContrasena);
api.put('/modificarTipoUsuario', usuarioControladores.modificarTipoUsuario);

module.exports = api;