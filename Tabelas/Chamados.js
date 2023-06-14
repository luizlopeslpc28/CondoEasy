////Importação de módulos:
const Sequelize = require('sequelize');
const db = require('../conexao/db');

//Importação para FG KEY
const User = require('./User');

//Definição do modelo de dados:
const Chamados = db.define('chamados', {
  idChamados: {
    type: Sequelize.INTEGER(4).ZEROFILL,
    primaryKey: true,
    autoIncrement: true,
    field: 'idChamados',
    allowNull: false,
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
  dataAbertura: {
    type: Sequelize.DATE,
    allowNull: false
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'idUsuario'
    }
  }
}, {
  timestamps: false // Desabilita os campos createdAt e updatedAt
});

//Sincronização da tabela:
//Chamados.sync();

//Exportação do modelo de dados:
module.exports = Chamados;
