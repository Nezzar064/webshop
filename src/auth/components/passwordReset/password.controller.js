const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {mailer} = require('../../../helpers/mailer');
const Token = require('./pwToken.model');
const {User} = require('../authentication');
const {auth_logger: logger} = require('../../../helpers/log');
const {AppError} = require("../../../error");

const moduleName = 'password.controller.js -';

exports.pwResetEmailGen = async (req, res, next) => {
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
    res.status(200).send('Password reset link successfully sent to your email account.');
};

exports.verifyPwResetForm = async (req, res, next) => {
    logger.info(`${moduleName} request to verify reset password token: ${JSON.stringify(req.params.id)}`);

    // Send status 400 if req.body is empty
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const token = await Token.findOne({token: req.params.token,}).exec();
    if (!token) {
        logger.error(`${moduleName} password reset token not valid ${JSON.stringify(req.params.token)}`);
        return next(new AppError('Invalid link or token expired!', 401, true));
    }

    logger.info(`${moduleName} password reset completed for userId: ${JSON.stringify(req.params.id)}`);
    res.status(200).send('Password successfully reset');

};

exports.pwReset = async (req, res, next) => {

    logger.info(`${moduleName} request to reset password for userId: ${JSON.stringify(req.params.id)}`);

    // Send status 400 if req.body is empty
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const token = await Token.findOne({token: req.params.token,}).exec();
    if (!token) {
        logger.error(`${moduleName} password reset token not valid ${JSON.stringify(req.params.token)}`);
        return next(new AppError('Invalid link or token expired!', 401, true));
    }

    // Find user, if no user exists, return message and status 400
    const user = await User.findById(token.user._id).exec();
    if (!user) {
        logger.error(`${moduleName} password reset user id not valid ${JSON.stringify(req.params.id)}`);
        return next(new AppError('No user matches id!', 400, true));
    }

    user.password = bcrypt.hashSync(req.body.password);
    await user.save();
    await token.delete();

    logger.info(`${moduleName} password reset completed for userId: ${JSON.stringify(req.params.id)}`);
    res.status(200).send('Password successfully reset');

};


