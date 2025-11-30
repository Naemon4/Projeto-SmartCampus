const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middleware/auth');
const adiminMiddleware = require('../middleware/adimin');

// Registrar usuário comum
router.post('/registrar', UsuarioController.registrar);

// Login
router.post('/login', UsuarioController.login);

module.exports = router;