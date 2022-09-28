const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config()

const app = express()

const pool = require('./connect');

pool.connect()

const validate = require('./middleware/validate');

const { userSchema, credentialsUserSchema } = require('./Schemas/UserSchema.');
const authenticatedUser = require('./middleware/userAuthenticated');

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
});

app.post('/login', validate(credentialsUserSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = ($1)', [email])

        const { id, name, email: emailUser, age, createdon } = user.rows[0]

        const checkPassword = await bcrypt.compare(password, user.rows[0].password)

        if (!checkPassword) {
            return res.status(401).json({ message: 'insert incorrect password!' })
        }

        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: user.rows[0].id
            },
            secret
        )

        const userResponse = { user: { id, name, emailUser, age, createdon }, token }

        return res.json(userResponse)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
});

app.get('/users', authenticatedUser, async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users')

        return res.status(200).json(users.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }
})

app.put('/users/:id/name', authenticatedUser, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {

        const newUser = await pool.query('UPDATE USERS SET name = ($1) WHERE id = ($2) RETURNING *', [name, id])

        return res.status(200).json(newUser.rows[0])

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }

})

app.listen(port, () => console.log(`Rodando servidor na porta ${port}`))