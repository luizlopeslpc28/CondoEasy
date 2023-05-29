const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eAdmin } = require('../middlewares/auth');
const User = require('../Tabelas/User');

router.get('/', eAdmin, async (req, res) => {
    // Código para obter os usuários
    await User.findAll({
        attributes: ['id', 'name', 'email', 'password', 'cpf'],
        order: [['id', "DESC"]]
    })
    .then((users) => {
        return res.json({
            erro: false,
            users,
            id_usuario_logado: req.userId
        });
    }).catch(() => {
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
    // Código para fazer o login do usuário
    
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Nenhum usuário com este e-mail"
        });
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!"
        });
    }

    var token = jwt.sign({id: user.id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        //expiresIn: 600 //10 min
        //expiresIn: 60 //1 min
        expiresIn: '7d' // 7 dia
    });

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
});

module.exports = router;
