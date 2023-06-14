//Importação de módulos:
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

//Importação das rotas:
const usersRoutes = require('./routes/users');
const chamadosRoutes = require('./routes/chamados');

app.use(cors());

app.use(bodyParser.json());

//Configuração das rotas:
app.use('/users', usersRoutes);
app.use('/chamados', chamadosRoutes);

//Rota de fallback para lidar com solicitações para a raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à API!');
});

//Inicialização do servidor:
app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
