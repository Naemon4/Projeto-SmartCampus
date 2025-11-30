const Predio = require('../models/Predio');

class PredioController {

    static async cadastrarPredio(req, res) {

        try {

            const { predio_nome } = req.body;

            if(!predio_nome){
                throw new Error('Nome do prédio vazio');
            }

            const predioExiste = await Predio.findOne({
                where: { nome: predio_nome }
            })

            if(predioExiste){
                throw new Error('Já existe um prédio com este nome');
            }

            await Predio.create({
                nome: predio_nome
            })

            res.json({success: true, message: 'Predio cadastrado com sucesso'});

        } catch (error) {
            console.error('Erro ao cadastrar prédio', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

    static async listarPredios(req, res) {

        try {

            const predios = await Predio.findAll();

            if (!predios) {
                throw new Error('Não foi possivel achar prédios')
            }

            res.json({ success: true, predios: predios })

        } catch (error) {
            console.error('Erro ao listar predios', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

}

module.exports = PredioController;