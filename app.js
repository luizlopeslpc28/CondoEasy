//Importação de módulos:
const express = require('express');
const app = express();

//Importação das rotas:
const usersRoutes = require('./routes/users');
const chamadosRoutes = require('./routes/chamados');

//Configuração do middleware JSON:
app.use(express.json());

//Configuração das rotas:
app.use('/users', usersRoutes);
app.use('/chamados', chamadosRoutes);

//Inicialização do servidor:
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
