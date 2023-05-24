const Sequelize = require('sequelize');

const sequelize = new Sequelize("condoeasy", "root", "130328Sl.", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizado com sucesso!");
}).catch( (erro)=> {
    console.log("Erro: Conexão com o banco de dados não realizado com sucesso! Erro gerado: " + erro);
});

module.exports = sequelize;