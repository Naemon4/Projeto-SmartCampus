const Usuario = require('../models/Usuario');

async function isAdmin(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await Usuario.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!user.admin) {
      return res.status(403).json({ error: "Acesso negado: apenas administradores" });
    }

    // Se passou nas verificações, segue para a próxima rota
    next();
  } catch (err) {
    console.error("Erro no middleware isAdmin:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = isAdmin;
