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
        attributes: ['name', 'tipo_usuario'], // Adicione 'tipo' como um atributo a ser retornado
        where: { idUsuario: decoded.idUsuario }
      });

      if (usuario) {
        dados.nomeUsuario = usuario.name;

        let tipoUsuario = '';
        if (usuario.tipo_usuario === 'morador') {
          tipoUsuario = 'Morador';
        } else if (usuario.tipo_usuario === 'funcionario') {
          tipoUsuario = 'Funcionário';
        } else if (usuario.tipo_usuario === 'sindico') {
          tipoUsuario = 'Síndico';
        }

        const chamadoCriado = await chamados.create(dados);

        return res.json({
          erro: false,
          mensagem: "Chamado cadastrado com sucesso!",
          NUMERO_OS: chamadoCriado.idChamados,
          ID_USUARIO: dados.usuarioId,
          SOLICITANTE: dados.nomeUsuario,
          TIPO_USUARIO: tipoUsuario
        });
      }
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
