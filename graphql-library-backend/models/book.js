const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    published: {
        type: String,
        required: false,
        minlength: 3
    },
    author: {
        type: String,
        required: true,
        minlength: 3
    },
    genres: [{
        type: String
    }
    ]
})

module.exports = mongoose.model('Book', schema)