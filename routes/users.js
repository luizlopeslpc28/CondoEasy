const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eAdmin } = require('../middlewares/auth');
const User = require('../Tabelas/User');

router.get('/', eAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['idUsuario', 'name', 'email', 'password', 'cpf'],
            order: [['idUsuario', 'DESC']]
        });

        if (users.length === 0) {
            return res.json({
                erro: false,
                mensagem: 'Nenhum usuário registrado',
                id_usuario_logado: req.userId
            });
        }

        const usersWithToken = users.map((user) => {
            const token = jwt.sign({ idUsuario: user.idUsuario }, 'SEU_SEGREDO'); // Gere o token para cada usuário aqui
            return { ...user.toJSON(), token }; // Adicione o token ao objeto do usuário
        });

        return res.json({
            erro: false,
            users: usersWithToken,
            id_usuario_logado: req.userId
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

router.delete('/usuarios/:id', eAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Usuário não encontrado'
        });
      }
      await user.destroy();
      return res.json({
        erro: false,
        mensagem: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao deletar o usuário. Por favor, tente novamente mais tarde.'
      });
    }
  });
  
router.put('/usuarios/:id', eAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          erro: true,
          mensagem: 'Usuário não encontrado'
        });
      }
  
      // Guardar os valores originais dos campos antes da atualização
      const originalName = user.name;
      const originalEmail = user.email;
      const originalPassword = user.password;
      const originalCpf = user.cpf;
      const originalApartamento = user.apartamento;
      const originalBloco = user.bloco;
      const originalTipo_usuario = user.tipo_usuario;
  
      // Atualize os dados do usuário com base nos valores fornecidos no corpo da solicitação
      const { name, email, password, cpf, apartamento, bloco, tipo_usuario } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password ? await bcrypt.hash(password, 8) : user.password;
      user.cpf = cpf || user.cpf;
      user.apartamento = apartamento || user.apartamento;
      user.bloco = bloco || user.bloco;
      user.tipo_usuario = tipo_usuario || user.tipo_usuario;
  
      await user.save();
  
      // Verificar quais campos foram alterados e criar uma mensagem personalizada
      const changes = [];
      if (user.name !== originalName) {
        changes.push('nome');
      }
      if (user.email !== originalEmail) {
        changes.push('email');
      }
      if (user.password !== originalPassword) {
        changes.push('senha');
      }
      if (user.cpf !== originalCpf) {
        changes.push('cpf');
      }
      if (user.apartamento !== originalApartamento) {
        changes.push('apartamento');
      }
      if (user.bloco !== originalBloco) {
        changes.push('bloco');
      }
      if (user.tipo_usuario !== originalTipo_usuario) {
        changes.push('tipo_usuario');
      }
  
      const alteracoes = changes.map((campo) => `O usuário alterou ${campo}`);
  
      return res.json({
        erro: false,
        mensagem: 'Dados do usuário atualizados com sucesso',
        alteracoes: alteracoes
      });
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro ao atualizar os dados do usuário. Por favor, tente novamente mais tarde.'
      });
    }
  });
  
  

module.exports = router;
