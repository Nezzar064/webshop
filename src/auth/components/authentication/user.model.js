const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'Username cannot be empty!']
        },
        email: {
            type: String,
            required: [true, 'Email cannot be empty!']
        },
        password: {
            type: String,
            required: [true, 'Password cannot be empty!']
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role',
            }
        ]
    })
);

module.exports = User;
