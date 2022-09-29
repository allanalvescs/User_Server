const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { CreateUser, verifyUser, selectUsers } = require('../services/user.services');
const pool = require('../connect');

async function singupPost(req, res) {
    const { name, email, password, age } = req.body;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        const createdon = new Date()

        const user = await CreateUser(name, email, passwordHash, age, createdon)

        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }
}

async function loginPost(req, res) {
    const { email, password } = req.body;

    const user = await verifyUser(email)

    if (!user) {
        return res.status(401).json({ message: 'user was not found!' })
    }

    try {

        const { id, name, email: emailUser, age, createdon } = user

        const checkPassword = await bcrypt.compare(password, user.password)


        if (!checkPassword) {
            return res.status(401).json({ message: 'insert incorrect password!' })
        }

        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: id
            },
            secret
        )

        const userResponse = { user: { id, name, emailUser, age, createdon }, token }

        return res.json(userResponse)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'error in the server' })
    }
}

async function usersGet(req, res) {
    try {
        const users = await selectUsers()

        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }
}

async function userNamePut(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {

        const newUser = await pool.query('UPDATE USERS SET name = ($1) WHERE id = ($2) RETURNING *', [name, id])

        return res.status(200).json(newUser.rows[0])

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error in the server' })
    }
}

module.exports = { singupPost, loginPost, usersGet, userNamePut }