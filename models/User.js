const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Change const User = ... to let User = ... or var User = ...
// let User = mongoose.model('users', UserSchema);

module.exports = mongoose.model('user', UserSchema);