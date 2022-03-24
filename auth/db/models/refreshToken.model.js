const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    expiryDate: Date,
});

// Function for creating refresh tokens
RefreshTokenSchema.statics.createRefreshToken = async (user) => {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds + process.env.REFRESH_TOKEN_EXPIRY
    );
    let _token = uuidv4();
    let rt = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt.getTime(),
    });

    let refreshToken = await rt.save();
    return refreshToken.token;
};

// Used for verifying expiry of refresh token
RefreshTokenSchema.statics.verifyRtExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};
const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

module.exports = RefreshToken;
