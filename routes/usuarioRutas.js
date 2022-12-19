
const usuarioControladores = require('../controllers/usuarioControladores');
const express = require('express')
const api = express.Router();

api.post('/existeUsuario', usuarioControladores.existeUsuario);


module.exports = api;