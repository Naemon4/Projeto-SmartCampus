const Sala = require('../models/Sala');
const Usuario = require('../models/Usuario');
const Andar = require('../models/Andar');
const Predio = require('../models/Predio');
const path = require('path');
const PDFDocument = require('pdfkit');

class SalaController {

    static async listarSalas(req, res) {

        try {

            const { predio_pertencente_nome, andar_numero } = req.body;

            if (!andar_numero || !predio_pertencente_nome || isNaN(Number(andar_numero))) {
                throw new Error("Algum dos campos estão vazios")
            }

            const predio = await Predio.findOne({
                where: { nome: predio_pertencente_nome }
            })

            if (!predio) {
                throw new Error('Prédio não existe')
            }

            const andar = await Andar.findOne({
                where: {
                    numero: Number(andar_numero),
                    predioId: predio.id
                }
            })

            if (!andar) {
                throw new Error('Andar não existe no prédio')
            }

            const salas = await Sala.findAll({
                where: {
                    andarId: andar.id
                }
            });

            res.json({ success: true, data: salas });

        } catch (error) {
            console.error('Erro ao listar salas', error)
            return res.status(500).json({ success: false, message: error })
        }

    }
    static async registrarSala(req, res) {

        try {

            const { nomeSala, andar_numero, predio_pertencente_nome } = req.body;

            if (!nomeSala || !andar_numero || !predio_pertencente_nome || isNaN(Number(andar_numero))) {
                throw new Error("Algum dos campos estão vazios")
            }

            const predio = await Predio.findOne({
                where: { nome: predio_pertencente_nome }
            })

            if (!predio) {
                throw new Error('Prédio não existe')
            }

            const andar = await Andar.findOne({
                where: {
                    numero: Number(andar_numero),
                    predioId: predio.id
                }
            })

            if (!andar) {
                throw new Error('Andar não existe no prédio')
            }

            const sala = await Sala.findOne({ 
                where: { 
                    nome: nomeSala,
                    andarId: andar.id
                } 
            })

            if (sala) {
                throw new Error("Sala com este nome neste andar já existe")
            }

            await Sala.create({
                nome: nomeSala,
                andarId: andar.id
            })

            res.json({ success: true, message: "Sala criada com sucesso" })

        } catch (error) {
            console.error('Erro ao registrar sala', error.message)
            return res.status(500).json({ success: false, message: error.message })
        }

    }

    static async gerarQRCodesPDF(req, res) {
        try {
            // 1. Buscar salas
            const salas = await Sala.findAll();

            // 2. Criar PDF
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="salas_qrcodes.pdf"');
            doc.pipe(res);

            // 3. Iterar salas e gerar QRCode
            for (const sala of salas) {
                const qrDataUrl = await QRCode.toDataURL(String(sala.id));
                const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
                const imgBuffer = Buffer.from(qrImage, 'base64');

                // 4. Adicionar ao PDF
                doc.fontSize(16).text(`Sala: ${sala.nome} (ID: ${sala.id})`, { align: 'left' });
                doc.image(imgBuffer, { fit: [150, 150] });
                doc.moveDown(2);
            }

            doc.end();
        } catch (error) {
            console.error('Erro ao gerar PDF', error);
            return res.status(500).json({ success: false, message: error });
        }
    }

}

module.exports = SalaController;
