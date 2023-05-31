const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const chamados = require('../Tabelas/Chamados');
const User = require('../Tabelas/User'); // Importe o modelo de usuário apropriado

router.post('/chamados', async (req, res) => {
  var dados = req.body;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    const decoded = jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");

    dados.usuarioId = decoded.idUsuario;

    try {
      // Consulta para obter o nome do usuário
      const usuario = await User.findOne({
        attributes: ['name'],
        where: { idUsuario: decoded.idUsuario }
      });

      if (usuario) {
        dados.nomeUsuario = usuario.name;
      }

      await chamados.create(dados);

      return res.json({
        erro: false,
        mensagem: "Chamado cadastrado com sucesso!",
        usuarioId: dados.usuarioId,
        nomeUsuario: dados.nomeUsuario
      });
    } catch (error) {
      console.error('Erro ao cadastrar o chamado: ', error);
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Chamado não cadastrado com sucesso!"
      });
    }
  }
});

module.exports = router;
