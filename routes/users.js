const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eAdmin } = require('../middlewares/auth');
const User = require('../Tabelas/User');

router.get('/', eAdmin, async (req, res) => {
    // Código para obter os usuários
    await User.findAll({
        attributes: ['idUsuario', 'name', 'email', 'password', 'cpf'],
        order: [['idUsuario', "DESC"]]
    })
    .then((users) => {
        return res.json({
            erro: false,
            users,
            id_usuario_logado: req.userId
        });
    }).catch((error) => {
        console.error('Erro ao listar o usuarios: ', error);
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    });    
});

router.post('/cadastrar', async (req, res) => {
    // Código para cadastrar um usuário
    var dados = req.body;

    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
    .then((user) => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!",
            tipo_usuario: user.tipo_usuario
        });
    }).catch((error) => {
        console.error(error);
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso!"
        });
    });    
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['idUsuario', 'name', 'email', 'password'],
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário ou senha incorreta! Nenhum usuário com este e-mail"
            });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário ou senha incorreta! Senha incorreta!"
            });
        }

        const token = jwt.sign({ idUsuario: user.idUsuario }, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
            //expiresIn: 600 //10 min
            //expiresIn: 60 //1 min
            expiresIn: '7d' // 7 dias
        });

        return res.json({
            erro: false,
            mensagem: "Login realizado com sucesso!",
            token
        });
    } catch (error) {
        console.error('Erro durante o login:', error);
        return res.status(500).json({
            erro: true,
            mensagem: "Erro durante o login. Por favor, tente novamente mais tarde."
        });
    }
});


module.exports = router;
