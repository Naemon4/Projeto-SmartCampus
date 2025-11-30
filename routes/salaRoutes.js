const express = require('express');
const SalaController = require('../controllers/SalaControllers')
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const adiminMiddleware = require('../middleware/adimin')

router.get('/listarSalas', SalaController.listarSalas);
router.get('/gerarQRCodes', authMiddleware, adiminMiddleware, SalaController.gerarQRCodesPDF);
router.post('/registrarSala', authMiddleware, adiminMiddleware, SalaController.registrarSala);

module.exports = router;