// models/Payday.js
const mongoose = require('mongoose');

const paydaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This references the User model
        required: true,
    },
});

module.exports = mongoose.model('Payday', paydaySchema);
