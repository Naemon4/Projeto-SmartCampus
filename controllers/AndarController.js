const Andar = require('../models/Andar');
const Predio = require('../models/Predio');

class AndarController {

    static async cadastrarAndar(req, res) {

        try {

            const { numero_andar, predio_pertencente_nome } = req.body

            if(!numero_andar || isNaN(Number(numero_andar)) || !predio_pertencente_nome){
                throw new Error('Numero do andar incorreto ou sem predio pertencente')
            }

            const predio = await Predio.findOne({
                where: {nome: predio_pertencente_nome}
            })

            if(!predio){
                throw new Error('Prédio não existe')
            }

            await Andar.create({
                numero: Number(numero_andar),
                predioId: predio.id
            })

            res.json({success: true, message:'Andar criado com sucesso'})

        } catch (error) {
            console.error('Erro ao cadastrar andar', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

    static async listarAndaresDoPredio(req, res) {

        try {

            const { predio_nome } = req.body;

            const predio = await Predio.findOne({
                where: { nome: predio_nome }
            })

            if (!predio) {
                throw new Error('Prédio não existe');
            }

            const andares = await Andar.findAll({
                where: { predioId: predio.id }
            })

            if (andares.length === 0) {
                throw new Error('Não existe andares neste prédio')
            }

            res.json({ success: true, andares: andares });

        } catch (error) {
            console.error('Erro ao listar andares', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

}

module.exports = AndarController;