const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../Tabelas/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['idUsuario', 'name', 'email', 'password', 'cpf'],
      order: [['idUsuario', 'DESC']]
    });

    if (users.length === 0) {
      return res.json({
        erro: false,
        mensagem: 'Nenhum usuário registrado'
      });
    }

    return res.json({
      erro: false,
      users,
    });
  } catch (error) {
    console.error('Erro ao listar os usuários: ', error);
    return res.status(400).json({
      erro: true,
      mensagem: 'Erro: Nenhum usuário encontrado!'
    });
  }
});

router.post('/cadastrar', async (req, res) => {
  try {
    const { name, email, password, cpf, apartamento, bloco } = req.body;

    const userExists = await User.findOne({
      where: {
        email: email
      }
    });

    if (userExists) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro: Este e-mail já está sendo usado por outro usuário!'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      cpf: cpf,
      apartamento: apartamento,
      bloco: bloco
    });

    return res.json({
      erro: false,
      mensagem: 'Usuário cadastrado com sucesso!'
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      erro: true,
      mensagem: 'Erro: Usuário não cadastrado com sucesso!'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro: Usuário ou senha incorreta!'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro: Usuário ou senha incorreta!'
      });
    }

    return res.json({
      erro: false,
      mensagem: 'Login realizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro durante o login:', error);
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro durante o login. Por favor, tente novamente mais tarde.'
    });
  }
});

module.exports = router;
