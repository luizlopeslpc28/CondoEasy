//Importação de módulos:
const Sequelize = require('sequelize');
const db = require('../conexao/db');

//Definição do modelo de dados:
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
});

//Sincronização da tabela:
//User.sync();

//Exportação do modelo de dados:
module.exports = User;