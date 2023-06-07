//Importação do Módulo
const Sequelize = require('sequelize');

//Definindo estrutura de conexão com o BD (Mysql)
const sequelize = new Sequelize("condoeasy", "root", "root", {
    host: "localhost",
    dialect: "mysql"
});

//Tratamento de conexão com o Banco
sequelize.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizado com sucesso!");
}).catch( (erro)=> {
    console.log("Erro: Conexão com o banco de dados não realizado com sucesso! Erro gerado: " + erro);
});

//Exportação do modelo de dados:
module.exports = sequelize;