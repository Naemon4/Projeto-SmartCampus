const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const adiminMiddleware = require('../middleware/adimin')
const PredioController = require('../controllers/PredioContoller');

router.post('/cadastrarPredio', authMiddleware, adiminMiddleware, PredioController.cadastrarPredio)
router.get('/listarPredios', authMiddleware, PredioController.listarPredios)

module.exports = router;