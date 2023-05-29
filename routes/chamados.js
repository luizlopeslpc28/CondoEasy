const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const chamados = require('../Tabelas/Chamados');

router.post('/chamados', async (req, res) => {
    var dados = req.body;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.substring(7);
        const decoded = jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");

        dados.usuarioId = decoded.id;
    }   

    await chamados.create(dados) 
    .then((chamado) => {
        return res.json({
            erro: false,
            mensagem: "Chamado cadastrado com sucesso!",
            usuarioId: chamado.usuarioId,
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Chamado não cadastrado com sucesso!"
        });
    });    
});

module.exports = router;
