const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const funcionario = db.define('funcionarios', {
    idFuncionario: {
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
    dataAdm: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    cargo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
    }
}
});

//Criar a tabela
//funcionario.sync();

module.exports = funcionario;