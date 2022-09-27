const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: 'user_server'
});

module.exports = pool