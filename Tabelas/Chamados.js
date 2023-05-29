const Sequelize = require('sequelize');
const db = require('../conexao/db');
const User = require('./User');

const Chamados = db.define('chamados', {
  idChamados: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  apartamento: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bloco: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ocorrencia: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  anexo: {
    type: Sequelize.BLOB,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'idUsuario'
    }
  }
});

//Chamados.sync();

module.exports = Chamados;
