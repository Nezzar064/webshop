const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {mailer} = require('../../helpers/mailer');
const Token = require('./pwToken.model');
const {User} = require('../authentication');
const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");

const moduleName = 'passwordReset.controller.js -';

exports.forgotPwEmailGen = async (req, res, next) => {
    logger.info(`${moduleName} request to send password reset email: ${JSON.stringify(req.body)}`);

    // Send status 400 if req.body is empty
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    // Find user, if no user exists, return message and status 400
    const user = await User.findOne({email: req.body.email}).exec();
    if (!user) {
        logger.error(`${moduleName} no match for user/email error ${JSON.stringify(req.body)}`);
        return next(new AppError('No user exists with given email', 404, true));
    }

    let token = await Token.findOne({userId: user._id}).exec();
    // Generate a token if one doesnt already exist
    if (!token) {
        logger.info(`${moduleName} generating new token`);
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        })
            .save();
    }

    // Send email with password reset link as HTML
    await mailer.sendEmail(
        user.email,
        'Request to reset Password',
        `<h1>Greetings.</h1>
        <br/>
        <p>Please use this code in order to reset your password!<p>
        <br/>
        <br/>
        <h2><strong>CODE:</strong> ${token.token}</h2>
        <br/>
        <p>Kind regards</p>`
    );

    logger.info(`${moduleName} pw reset link successfully sent to user ${JSON.stringify(user._id)}`);
    res.status(200).send('Password reset link successfully sent to your email account');
};

exports.verifyForgotPwForm = async (req, res, next) => {
    logger.info(`${moduleName} request to verify reset password token: ${JSON.stringify(req.params.id)}`);

    await validateBodyAndGetToken(req, next);

    logger.info(`${moduleName} pw reset token verified ${JSON.stringify(req.params.id)}`);
    res.status(200).send('Token successfully verified');
};

exports.forgotPwReset = async (req, res, next) => {

    logger.info(`${moduleName} request to reset password for userId: ${JSON.stringify(req.params.id)}`);

    const token = await validateBodyAndGetToken(req, next, true);

    // Find user, if no user exists, return message and status 400
    const user = await User.findById(token.user._id).exec();
    if (!user) {
        logger.error(`${moduleName} password reset user id not valid ${JSON.stringify(req.params.id)}`);
        return next(new AppError('User not found!', 401, true));
    }

    user.password = bcrypt.hashSync(req.body.password);
    await user.save();
    await token.delete();

    logger.info(`${moduleName} password reset completed for userId: ${JSON.stringify(req.params.id)}`);
    res.status(200).send('Password successfully reset');

};

exports.pwReset = async (req, res, next) => {

    // Send status 400 if req.body is empty
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const user = await User.findById(req.userId).exec();

    // if user doesnt exist, return 401
    if (!user) {
        logger.error(`${moduleName} user to change password for not found ${JSON.stringify(req.userId)}`);
        return next(new AppError('No user found!', 401, true));
    }

    //if old password doesnt match, send 401
    if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
        logger.error(`${moduleName} old password does not match db value ${JSON.stringify(req.userId)}`);
        return next(new AppError('Old password is not valid!', 401, true));
    }

    user.password = bcrypt.hashSync(req.body.newPassword);

    await user.save();

    res.status(200).send({message: 'Password successfully updated!'});

};

//Helper function to avoid duplicate code
const validateBodyAndGetToken = async (req, next, includeToken) => {
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const token = await Token.findOne({token: req.params.token,}).exec();
    if (!token) {
        logger.error(`${moduleName} password reset token not valid ${JSON.stringify(req.params.token)}`);
        return next(new AppError('Invalid link or token expired!', 401, true));
    }

    if (includeToken) {
        return token;
    }
};

