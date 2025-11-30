const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');
const authMiddleware = require('../middleware/auth');

// Rota para criar um agendamento
router.post('/agendar', authMiddleware, AgendamentoController.agendar);

// Rota para listar agendamentos de um usuário
router.post('/listarAgendamentosUsuario', authMiddleware, AgendamentoController.listarAgendamentosUsuario);

module.exports = router;
