const express = require('express');
const dotenv = require('dotenv');

dotenv.config()

const app = express()

const pool = require('./connect');

pool.connect()

const routerUsers = require('./Routes/userRoutes');

const port = 8080;

app.use(express.json())

app.use('/', routerUsers)

app.listen(port, () => console.log(`Rodando servidor na porta ${port}`))