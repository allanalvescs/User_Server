const pool = require("../connect");

async function CreateUser(name, email, password, age, createdon) {
    const user = await pool.query(
        'INSERT INTO users(name,email,password,age,createdon) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [name, email, password, age, createdon]
    )

    return user.rows[0]
}

async function verifyUser(email) {
    const user = await pool.query('SELECT * FROM users WHERE email = ($1)', [email])

    return user.rows[0]
}

async function selectUsers() {
    const users = await pool.query('SELECT * FROM users')

    return users.rows
}

module.exports = { CreateUser, verifyUser, selectUsers }