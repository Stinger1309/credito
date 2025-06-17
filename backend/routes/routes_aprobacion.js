const express = require('express');
const router = express.Router();
const aprobacionController = require('../controllers/controlador_aprobacion');

// Ruta para obtener todas las aprobaciones
router.get('/', aprobacionController.getAprobaciones);

// Ruta para registrar una aprobación
router.post('/', aprobacionController.crearAprobacion);

module.exports = router;