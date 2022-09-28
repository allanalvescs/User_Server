const jwt = require('jsonwebtoken')

async function authenticatedUser(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(422).json({ message: 'Missing token' })
    }

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret)

        next()

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorization Token' })
    }
}

module.exports = authenticatedUser