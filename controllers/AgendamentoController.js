const Usuario = require('../models/Usuario');
const Sala = require('../models/Sala');
const Predio = require('../models/Predio');
const Andar = require('../models/Andar');
const Agendamento = require('../models/Agendamento');


class AgendamentoController {

    static async agendar(req, res) {

        try {
            
            const { predio_nome, andar, sala_nome, data, horario_inicio, horario_fim } = req.body;
            const usuario_id = req.user.id;

            if (!predio_nome || !andar || !sala_nome || !data || !horario_inicio || !horario_fim) {
                throw new Error('Todos os campos são obrigatórios');
            }

            const predio = await Predio.findOne({ where: { nome: predio_nome } });

            if (!predio) {
                throw new Error('Prédio não encontrado');
            }

            const andarExiste = await Andar.findOne({ where: { numero: andar,  predioId: predio.id} });

            if (!andarExiste) {
                throw new Error('Andar não encontrado no prédio especificado');
            }

            const sala = await Sala.findOne({ where: { nome: sala_nome, andarId: andarExiste.id } });

            if (!sala) {
                throw new Error('Sala não encontrada no andar especificado');
            }

            const agendamentoExistente = await Agendamento.findOne({where: {
                sala_id: sala.id,
                data_agendamento: data,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim
            }});

            if(agendamentoExistente){
                throw new Error('Já existe um agendamento para esta sala neste horário');
            }

            const novoAgendamento = await Agendamento.create({
                usuario_id,
                sala_id: sala.id,
                data_agendamento: data,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim
            });

            res.json({ success: true, data: novoAgendamento });

        } catch (error) {
            console.error('Erro ao criar agendamento', error.message)
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
