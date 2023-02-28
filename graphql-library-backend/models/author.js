const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    born: {
        type: String,
        required: false,
        minlength: 3
    },
})

module.exports = mongoose.model('Author', schema)