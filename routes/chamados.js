const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const chamados = require('../Tabelas/Chamados');
const User = require('../Tabelas/User');
const moment = require('moment');
const Chamados = require('../Tabelas/Chamados');

router.post('/chamados', async (req, res) => {
  var dados = req.body;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.substring(7);
    const decoded = jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");

    dados.usuarioId = decoded.idUsuario;

    try {
      const usuario = await User.findOne({
        attributes: ['name', 'tipo_usuario'],
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

        const numeroOS = chamadoCriado.idChamados.toString().padStart(4, '0');
        
        const dataAbertura = moment(chamadoCriado.dataAbertura).format('DD/MM/YYYY HH:mm:ss');

        return res.json({
          erro: false,
          mensagem: "Chamado cadastrado com sucesso!",
          NUMERO_OS: numeroOS,
          ID_USUARIO: dados.usuarioId,
          SOLICITANTE: dados.nomeUsuario,
          TIPO_USUARIO: tipoUsuario,
          DATA_ABERTURA: dataAbertura
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

router.get('/lerChamados', async (req, res) => {
  try {
    const listaChamados = await Chamados.findAll({
      attributes: ['idChamados', 'local', 'apartamento', 'bloco', 'ocorrencia', 'descricao', 'dataAbertura', 'usuarioId'],
      order: [['idChamados', 'DESC']]
    });

    const listaChamadosFormatada = await Promise.all(
      listaChamados.map(async chamado => {
        const chamadoFormatado = chamado.toJSON();
        const usuario = await User.findOne({
          attributes: ['name', 'tipo_usuario'],
          where: { idUsuario: chamadoFormatado.usuarioId }
        });
        if (usuario) {
          chamadoFormatado.nomeUsuario = usuario.name;
          chamadoFormatado.tipoUsuario = usuario.tipo_usuario;
        }
        chamadoFormatado.dataAbertura = moment(chamado.dataAbertura).format('DD/MM/YYYY HH:mm:ss');
        return chamadoFormatado;
      })
    );

    return res.json({
      erro: false,
      CHAMADOS: listaChamadosFormatada
    });
  } catch (error) {
    console.error('Erro ao listar os chamados: ', error);
    return res.status(400).json({
      erro: true,
      mensagem: 'Erro: Nenhum chamado encontrado!'
    });
  }
});

router.delete('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chamado = await Chamados.findByPk(id);
    if (!chamado) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Chamado não encontrado'
      });
    }
    await chamado.destroy();
    return res.json({
      erro: false,
      mensagem: 'Chamado deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar o chamado:', error);
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro ao deletar o chamado. Por favor, tente novamente mais tarde.'
    });
  }
});

router.put('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chamado = await Chamados.findByPk(id);
    if (!chamado) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Chamado não encontrado'
      });
    }

    // Guardar os valores originais dos campos antes da atualização
    const originalLocal = chamado.local;
    const originalApartamento = chamado.apartamento;
    const originalBloco = chamado.bloco;
    const originalOcorrencia = chamado.ocorrencia;
    const originalAnexo = chamado.anexo;
    const originaldescricao = chamado.descricao;
    const originalDataAbertura = chamado.dataAbertura;

    const { local, apartamento, bloco, ocorrencia, descricao, dataAbertura } = req.body;
    chamado.local = local || chamado.local;
    chamado.apartamento = apartamento || chamado.apartamento;
    chamado.bloco = bloco || chamado.bloco;
    chamado.ocorrencia = ocorrencia || chamado.ocorrencia;
    chamado.descricao = descricao || chamado.descricao;
    chamado.dataAbertura = dataAbertura || chamado.dataAbertura;

    await chamado.save();

    // Verificar quais campos foram alterados e criar uma mensagem personalizada
    const changes = [];
    if (chamado.local !== originalLocal) {
      changes.push('local');
    }
    if (chamado.apartamento !== originalApartamento) {
      changes.push('apartamento');
    }
    if (chamado.bloco !== originalBloco) {
      changes.push('bloco');
    }
    if (chamado.ocorrencia !== originalOcorrencia) {
      changes.push('ocorrencia');
    }
    if (chamado.anexo !== originalAnexo) {
      changes.push('anexo');
    }
    if (chamado.descricao !== originaldescricao) {
      changes.push('descricao');
    }
    if (chamado.dataAbertura !== originalDataAbertura) {
      changes.push('dataAbertura');
    }

    const alteracoes = changes.map((campo) => `O usuario alterou ${campo}`);

    return res.json({
      erro: false,
      mensagem: 'Dados do chamado atualizados com sucesso',
      alteracoes: alteracoes
    });
  } catch (error) {
    console.error('Erro ao atualizar os dados do chamado:', error);
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro ao atualizar os dados do chamado. Por favor, tente novamente mais tarde.'
    });
  }
});


module.exports = router;
