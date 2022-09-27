const yup = require('yup');

const userSchema = yup.object().shape({
    name: yup.string().required().min(2, 'insert a real name!'),
    email: yup.string().email().required(),
    age: yup.number().min(18).required(),
    password: yup.string().required().min(6)
})


module.exports = userSchema