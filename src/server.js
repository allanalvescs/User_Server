const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');

dotenv.config()

const app = express()

const pool = require('./connect');
const validate = require('./middleware/validate');
const userSchema = require('./Schemas/UserSchema.');
pool.connect()

const port = 3333;

app.use(express.json())

app.post('/singup', validate(userSchema), async (req, res) => {
    const { name, email, password, age } = req.body;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        const createdon = new Date()

        const user = await pool.query(
            'INSERT INTO users(name,email,password,age,createdon) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, email, passwordHash, age, createdon]
        );


        return res.status(201).json(user.rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }
})

app.listen(port, () => console.log(`Rodando servidor na porta ${port}`))