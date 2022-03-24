const mongoose = require('mongoose');

const pwToken = mongoose.model(
    'PwToken',
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        token: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600,
        },
    })
);

module.exports = pwToken;