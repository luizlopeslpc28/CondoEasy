const express = require('express');
const router = express.Router();
const chamados = require('../Tabelas/Chamados');
const User = require('../Tabelas/User');
const moment = require('moment');
const Chamados = require('../Tabelas/Chamados');

router.post('/chamados', async (req, res) => {
  var dados = req.body;

  try {
    // Defina o status como "aberto" caso não seja fornecido
    if (!dados.status) {
      dados.status = 'Em Aberto';
    }

    const chamadoCriado = await Chamados.create(dados);

    const numeroOS = chamadoCriado.idChamados.toString().padStart(4, '0');
    
    const dataAbertura = moment(chamadoCriado.dataAbertura).format('DD/MM/YYYY HH:mm:ss');

    return res.json({
      erro: false,
      mensagem: "Chamado cadastrado com sucesso!",
      Número: numeroOS,
      descrição: chamadoCriado.descricao,
      data: dataAbertura,
      status: chamadoCriado.status
    });
  } catch (error) {
    console.error('Erro ao cadastrar o chamado: ', error);
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Chamado não cadastrado com sucesso!"
    });
  }
});

router.get('/lerChamados', async (req, res) => {
  try {

    const listaChamados = await Chamados.findAll({
      attributes: ['idChamados', 'descricao', 'dataAbertura', 'status'],
      order: [['idChamados', 'DESC']]
    });

    const listaChamadosFormatada = listaChamados.map(chamado => {
      const chamadoFormatado = chamado.toJSON();
      chamadoFormatado.dataAbertura = moment(chamado.dataAbertura).format('DD/MM/YYYY');
      return chamadoFormatado;
    });

    return res.status(200).json({
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



//Rota PUT para atualizar dados do Chamado
// router.put('/chamados/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const chamado = await Chamados.findByPk(id);
//     if (!chamado) {
//       return res.status(404).json({
//         erro: true,
//         mensagem: 'Chamado não encontrado'
//       });
//     }

//     // Guardar os valores originais dos campos antes da atualização
//     const originalLocal = chamado.local;
//     const originalApartamento = chamado.apartamento;
//     const originalBloco = chamado.bloco;
//     const originalOcorrencia = chamado.ocorrencia;
//     const originalAnexo = chamado.anexo;
//     const originalDescricao = chamado.descricao;
//     const originalDataAbertura = chamado.dataAbertura;
//     const originalDataFechamento = chamado.dataFechamento;
//     const originalStatus = chamado.status;

//     const { local, apartamento, bloco, ocorrencia, descricao, dataAbertura, dataFechamento, status } = req.body;
//     chamado.local = local || chamado.local;
//     chamado.apartamento = apartamento || chamado.apartamento;
//     chamado.bloco = bloco || chamado.bloco;
//     chamado.ocorrencia = ocorrencia || chamado.ocorrencia;
//     chamado.descricao = descricao || chamado.descricao;
//     chamado.dataAbertura = dataAbertura || chamado.dataAbertura;
//     chamado.dataFechamento = dataFechamento || chamado.dataFechamento;
//     chamado.status = status || chamado.status;

//     if (dataFechamento && chamado.status !== 'Encerrado') {
//       chamado.status = 'Encerrado';
//     }

//     await chamado.save();

//     // Verificar quais campos foram alterados e criar uma mensagem personalizada
//     const changes = [];
//     if (chamado.local !== originalLocal) {
//       changes.push('local');
//     }
//     if (chamado.apartamento !== originalApartamento) {
//       changes.push('apartamento');
//     }
//     if (chamado.bloco !== originalBloco) {
//       changes.push('bloco');
//     }
//     if (chamado.ocorrencia !== originalOcorrencia) {
//       changes.push('ocorrencia');
//     }
//     if (chamado.anexo !== originalAnexo) {
//       changes.push('anexo');
//     }
//     if (chamado.descricao !== originalDescricao) {
//       changes.push('descricao');
//     }
//     if (chamado.dataAbertura !== originalDataAbertura) {
//       changes.push('dataAbertura');
//     }
//     if (chamado.dataFechamento !== originalDataFechamento) {
//       changes.push('dataFechamento');
//     }
//     if (chamado.status !== originalStatus) {
//       changes.push('status');
//     }

//     const alteracoes = changes.map((campo) => `O usuário alterou ${campo}`);

//     return res.json({
//       erro: false,
//       mensagem: 'Dados do chamado atualizados com sucesso',
//       alteracoes: alteracoes
//     });
//   } catch (error) {
//     console.error('Erro ao atualizar os dados do chamado:', error);
//     return res.status(500).json({
//       erro: true,
//       mensagem: 'Erro ao atualizar os dados do chamado. Por favor, tente novamente mais tarde.'
//     });
//   }
// });

//Rota DELETE para deletar o chamado
// router.delete('/chamados/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const chamado = await Chamados.findByPk(id);
//     if (!chamado) {
//       return res.status(404).json({
//         erro: true,
//         mensagem: 'Chamado não encontrado'
//       });
//     }
//     await chamado.destroy();
//     return res.json({
//       erro: false,
//       mensagem: 'Chamado deletado com sucesso'
//     });
//   } catch (error) {
//     console.error('Erro ao deletar o chamado:', error);
//     return res.status(500).json({
//       erro: true,
//       mensagem: 'Erro ao deletar o chamado. Por favor, tente novamente mais tarde.'
//     });
//   }
// });

module.exports = router;
