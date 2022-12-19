const sugerenciaControladores = require('../controllers/sugerenciaControladores');
const express = require('express')
const api = express.Router();

api.post('/sugerencia', sugerenciaControladores.crearSugerencia); 
api.get('/sugerencias', sugerenciaControladores.obtenerSugerencias);
api.delete('/sugerencia/:id', sugerenciaControladores.eliminarSugerencia);

module.exports = api