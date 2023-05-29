const express = require('express');
const app = express();

const usersRoutes = require('./routes/users');
const chamadosRoutes = require('./routes/chamados');

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/chamados', chamadosRoutes);

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
