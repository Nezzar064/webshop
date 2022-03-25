const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const Token = require('../db/models/pwToken.model');
const User = require('../db/models/user.model');
const logger = require('../utils/logger');

const moduleName = 'password.controller.js -';

exports.pwResetEmailGen = async (req, res) => {
    try {
        logger.info(`${moduleName} request to send password reset email: ${JSON.stringify(req.body)}`);

        // Send status 400 if req.body is empty
        if (!req.body) {
            logger.error(`${moduleName} invalid/no email supplied`);
            res.status(400).send({message: 'Invalid/no email supplied'});
            return;
        }

        // Find user, if no user exists, return message and status 400
        const user = await User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                logger.error(`${moduleName} no match for user/email error ${JSON.stringify(req.body)}`);
                res.status(400).send({message: 'No user exists with given email'});
                return;
            }
            return user;
        });

        // Find token if it exists, else generate new one
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            logger.info(`${moduleName} generating new token`);
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            })
            .save();
        }

        // Link for password reset
        const link = `${process.env.AUTH_BASE}/pw-reset/${user._id}/${token.token}`;

        // Send email with password reset link as HTML
        await sendEmail(
            user.email, 
            'Request to reset Password', 
            `<h1>Greetings.</h1>
            <br/>
            <p>Please click the link in order to reset your password!<p>
            <br/>
            <br/>
            <a href=${link}>Link to reset password</a>
            <br/>
            <p>Kind regards</p>`
            );
        
        res.status(200).send('Password reset link successfully sent to your email account.');
    } catch (err) {
        logger.error(`${moduleName} send password reset link unexpected error ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

exports.pwReset = async (req, res) => {
    try {
        logger.info(`${moduleName} request to reset password for userId: ${JSON.stringify(req.params.id)}`);

        // Send status 400 if req.body is empty
        if (!req.body) {
            return res.status(400).send({message: 'Invalid/no password supplied'});
        }

        // Find user, if no user exists, return message and status 400
        const user = await User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                logger.error(`${moduleName} password reset user id not valid ${JSON.stringify(req.params.id)}`);
                res.status(400).send({message: 'No user matches id'});
                return;
            }
            return user;
        });

        // Find token, if no token exists, return message and status 400
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        })
        .then((token) => {
            if (!token) {
                logger.error(`${moduleName} password reset token not valid ${JSON.stringify(req.params.token)}`);
                res.status(400).send({message: 'Invalid link or token expired'});
                return;
            }
            return token;
        });

        // encode password, save user and delete token
        user.password = bcrypt.hashSync(req.body.password);
        await user.save();
        await token.delete();
        
        logger.info(`${moduleName} password reset completed for userId: ${JSON.stringify(req.params.id)}`);
        res.status(200).send('Password successfully reset');
    } catch (err) {
        logger.error(`${moduleName} send password reset link unexpected error ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};


