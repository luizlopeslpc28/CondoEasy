const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Reservas = db.define('reservas', {
    idRersevas: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    bloco: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apartamento: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    area: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reservado: {
        type: Sequelize.DATE,
        allowNull: false,
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

Reservas.belongsTo(User, { foreignKey: 'usuarioId' });

//Criar a tabela
//reservas.sync();

module.exports = Reservas;