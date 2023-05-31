const Sequelize = require('sequelize');
const db = require('../conexao/db');

const User = db.define('users', {
    idUsuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apartamento: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    bloco: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo_usuario: {
        type: Sequelize.ENUM('sindico', 'morador', 'funcionario'),
        allowNull: false
    }
});

//User.sync();

module.exports = User;