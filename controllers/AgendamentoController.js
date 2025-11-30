const Agendamento = require('../models/Agendamento');
const Usuario = require('../models/Usuario');
const Sala = require('../models/Sala');

class AgendamentoController {

    static async agendar(req, res) {

        try {
            
            const { usuario_id, sala_id, data_agendamento, horario_inicio, horario_fim } = req.body;

            // Validações básicas
            if (!usuario_id || !sala_id || !data_agendamento || !horario_inicio || !horario_fim) {
                throw new Error('Todos os campos são obrigatórios');
            }

            // Verifica se a sala existe
            const sala = await Sala.findByPk(sala_id);
            const usuario = await Usuario.findByPk(usuario_id);

            if (!sala || !usuario) {
                throw new Error('Sala não encontrada');
            }

            // Cria o agendamento
            const agendamento = await Agendamento.create({
                usuario_id,
                sala_id,
                data_agendamento,
                horario_inicio,
                horario_fim
            });

            res.json({ success: true, message: 'Agendamento realizado com sucesso!'});

        } catch (error) {
            console.error('Erro ao agendar', error.message)
            return res.status(500).json({success: false, message: error.message})
        }

    }

    static async listarAgendamentosUsuario(req, res) {

        try {
            
            const { usuario_id } = req.body;

            if (!usuario_id) {
                throw new Error('ID do usuário é obrigatório');
            }

            const usuario = await Usuario.findByPk(usuario_id);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const agendamentos = await Agendamento.findAll({
                where: { usuario_id },
                include: [{ model: Sala }]
            });

            if(agendamentos.length === 0){
                throw new Error('Nenhum agendamento encontrado para este usuário');
            }

            res.json({ success: true, data: agendamentos });

        } catch (error) {
            console.error('Erro ao puxar os agendamentos', error.message)
            return res.status(500).json({success: false, message: error.message})
        }

    }

}

module.exports = AgendamentoController;
