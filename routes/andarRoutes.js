const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const adiminMiddleware = require('../middleware/adimin')
const AndarController = require('../controllers/AndarController');

router.post('/cadastrarAndar', authMiddleware, adiminMiddleware, AndarController.cadastrarAndar)
router.post('/listarAndaresDoPredio', AndarController.listarAndaresDoPredio)

module.exports = router;