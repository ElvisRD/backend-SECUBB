const imagenControladores = require('../controllers/imagenControladores');
const express = require('express')
const upload = require('../middleware/handleMulter')
const fileSize = require('../middleware/fileSize')
const api = express.Router();

api.post('/imagen/:tipo/:idAlerta', upload.single('archivo') ,fileSize, imagenControladores.guardarImagen); 
api.get('/imagen/:idAlerta', imagenControladores.obtenerImagen);

module.exports = api