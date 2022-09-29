const express = require('express');

const routerUsers = express.Router();

const validate = require('../middleware/validate');

const authenticatedUser = require('../middleware/userAuthenticated')

const { singupPost, loginPost, usersGet, userNamePut } = require('../controllers/user.controllers');

const { userSchema, credentialsUserSchema } = require('../models/UserSchema.');

routerUsers.post('/singup', validate(userSchema), singupPost);

routerUsers.post('/login', validate(credentialsUserSchema), loginPost);

routerUsers.get('/users', authenticatedUser, usersGet)

routerUsers.put('/users/:id/name', authenticatedUser, userNamePut)

module.exports = routerUsers