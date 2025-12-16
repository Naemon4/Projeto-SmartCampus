const Agendamento = require("../models/Agendamento");
const Sala = require("../models/Sala");

class agendamentoService {
    static async verificarAgendamentos() {
        try {
            const agora = new Date();
            const dataHoje = agora.toISOString().split("T")[0]; // YYYY-MM-DD
            const horaAtual = agora.toTimeString().slice(0, 5); // HH:mm

            // Buscar agendamentos do dia
            const agendamentos = await Agendamento.findAll({
                where: { data_agendamento: dataHoje }
            });

            for (const ag of agendamentos) {
                if (horaAtual >= ag.horario_inicio && horaAtual <= ag.horario_fim) {
                    // Atualiza sala para ocupado
                    await Sala.update(
                        { status: "ocupado" },
                        { where: { id: ag.sala_id } }
                    );
                } else {
                    // Fora do horário → sala livre
                    await Sala.update(
                        { status: "livre" },
                        { where: { id: ag.sala_id } }
                    );
                }
            }
        } catch (err) {
            console.error("Erro na verificação de agendamentos:", err.message);
        }
    }
}


module.exports = agendamentoService
