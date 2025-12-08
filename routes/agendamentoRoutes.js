const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');
const authMiddleware = require('../middleware/auth');

router.post('/agendar', authMiddleware, AgendamentoController.agendar);
router.post('/agendarAgora', authMiddleware, AgendamentoController.agendarHorarioAtual)
router.get('/listarAgendamentosUsuario', authMiddleware, AgendamentoController.listarAgendamentosUsuario);

module.exports = router;
