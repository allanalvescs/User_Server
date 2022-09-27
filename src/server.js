const express = require('express');
const dotenv = require('dotenv');

dotenv.config()

const app = express()

const pool = require('./connect');
pool.connect()

const port = 3333;

app.use(express.json())

app.listen(port, () => console.log(`Rodando servidor na porta ${port}`))