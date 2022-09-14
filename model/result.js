const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    subject: {
        required: true,
        type: String
    },
    marks: {
        required: true,
        type: Number
    },
    grade: {
        required: true,
        type: String
    },
    userid_fk: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('mark', dataSchema)