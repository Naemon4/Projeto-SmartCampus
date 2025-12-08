const Usuario = require('../models/Usuario');
const Sala = require('../models/Sala');
const Predio = require('../models/Predio');
const Andar = require('../models/Andar');
const Agendamento = require('../models/Agendamento');
const jwt = require("jsonwebtoken")
const SECRET = process.env.JWT_SECRET;


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

            const andarExiste = await Andar.findOne({ where: { numero: andar, predioId: predio.id } });

            if (!andarExiste) {
                throw new Error('Andar não encontrado no prédio especificado');
            }

            const sala = await Sala.findOne({ where: { nome: sala_nome, andarId: andarExiste.id } });

            if (!sala) {
                throw new Error('Sala não encontrada no andar especificado');
            }

            const agendamentoExistente = await Agendamento.findOne({
                where: {
                    sala_id: sala.id,
                    data_agendamento: data,
                    horario_inicio: horario_inicio,
                    horario_fim: horario_fim
                }
            });

            if (agendamentoExistente) {
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
            return res.status(500).json({ success: false, message: error.message })
        }

    }

    static async agendarHorarioAtual(req, res) {
        try {

            const { salaId } = req.body

            if (!salaId) throw new Error("Campo vazio inexistente");

            const sala = await Sala.findByPk(salaId)

            const andar = await Andar.findByPk(sala.andarId);

            if (!andar) throw new Error("Andar não existe");

            const predio = await Predio.findByPk(andar.predioId);

            if (!predio) throw new Error('Prédio não existe');

            const agora = new Date();
            const dataServidor = agora.toISOString().split("T")[0]; // yyyy-mm-dd
            const horario_inicio = agora.toTimeString().slice(0, 5); // HH:mm
            const horario_fim = new Date(agora.getTime() + 60 * 60 * 1000) // +1h
                .toTimeString().slice(0, 5);

            const agendamentoExistente = await Agendamento.findOne({
                where: {
                    sala_id: sala.id,
                    data_agendamento: dataServidor,
                    horario_inicio,
                    horario_fim
                }
            })

            if (agendamentoExistente) throw new Error('Está sala está ocupada');

            const novoAgendamento = await Agendamento.create({
                usuario_id: req.user.id,
                sala_id: sala.id,
                data_agendamento: dataServidor,
                horario_inicio,
                horario_fim
            });

            res.json({success: true})

        } catch (error) {
            console.error('Erro ao criar agendamento', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }
    }

    static async listarAgendamentosUsuario(req, res) {

        try {

            const token = req.cookies.token;
            const decoded = jwt.verify(token, SECRET);

            const agendamentos = await Agendamento.findAll({
                where: { usuario_id: decoded.id },
                include: [{ model: Sala }]
            });

            if (agendamentos.length === 0) {
                throw new Error('Nenhum agendamento encontrado para este usuário');
            }

            res.json({ success: true, data: agendamentos });

        } catch (error) {
            console.error('Erro ao puxar os agendamentos', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

}

module.exports = AgendamentoController;
