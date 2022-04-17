const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../db/models/user.model');
const Role = require('../db/models/role.model');
const RefreshToken = require('../db/models/refreshToken.model');
const logger = require('../utils/logger');
const key = fs.readFileSync('private-key.pem');

const moduleName = 'auth.controller.js';

exports.signUp = async (req, res) => {
    logger.info(`${moduleName} request to signup user ${JSON.stringify(req.body)}`);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    });
    try {
        // defaulting to user role if no roles are present in body
        if (!req.body.roles) {
            logger.debug(`${moduleName} using default user role for signup`);
            const role = await Role.findOne({ name: "user" }).exec();
            user.roles = [role._id];

            await user.save();

            logger.info(`${moduleName} user successfully saved using default role (user)`);
            res.status(200).send({ message: "User successfully signed up!" });
            return;
        }

        logger.debug(`${moduleName} using roles from req.body for signup ${JSON.stringify(req.body.roles)}`);

        const roles = await Role.find({ name: { $in: req.body.roles } }).exec();
        user.roles = roles.map(role => role._id);

        await user.save();
        logger.info(`${moduleName} user successfully signed up ${JSON.stringify(user)}`);
        res.status(200).send({ message: 'User successfully signed up!' });


    } catch (e) {
        logger.error(`${moduleName} unexpected error during sign-up ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.signIn = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).populate('roles', '-__v').exec();
        if (!user) {
            logger.error(`${moduleName} user not present in database`);
            res.status(400).send({ message: 'User could not be found!' });
            return;
        }

        // Create access token upon login
        let token = await generateJWT(user);

        // Find refresh token if it exists, otherwise create a new one.
        let refreshToken = await RefreshToken.findOne({ user: user._id }).exec();
        if (!refreshToken) {
            logger.info(`${moduleName} created new refresh token for user ${JSON.stringify(user._id)}`);
            refreshToken = await RefreshToken.createRefreshToken(user);
        }

        const _roles = [];
        user.roles.forEach(role => {
            _roles.push(`ROLE_${role.name.toString().toUpperCase()}`);
        });

        logger.info(`${moduleName} user successfully authenticated ${JSON.stringify(user)}`);

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: _roles,
            accessToken: token,
            refreshToken: refreshToken.token,
        });
    } catch (e) {
        logger.error(`${moduleName} unexpected error during sign-in ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken: requestToken } = req.body;
        if (!requestToken) {
            logger.error(`${moduleName} refreshToken empty body`);
            return res.status(403).send({ message: 'Refresh token is required' });
        }

        const refreshToken = await RefreshToken.findOne({ token: requestToken }).exec();
        if (!refreshToken) {
            logger.error(`${moduleName} Refresh Token not present in database`);
            res.status(403).send({ message: 'Refresh token could not be found!' });
            return;
        }

        // Verify expiry, if expired, remove it and prompt for new sign-in
        if (RefreshToken.verifyRtExpiration(refreshToken)) {
            logger.info(`${moduleName} Refresh Token is expired, requested for new login`);

            await RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false });
            res.status(403).send({ message: 'Refresh token is expired, please sign in again.' });
            return;
        }

        const user = await User.findById(refreshToken.user._id).exec();
        if (!user) {
            logger.error(`${moduleName} User representing refresh token not found`);
            res.status(403).send({ message: 'User representing refresh token not found!' });
            return;
        }

        // Generate new access token
        let _accessToken = await generateJWT(user);

        return res.status(200).send({
            accessToken: _accessToken,
            refreshToken: refreshToken.token,
        });

    } catch (e) {
        logger.info(`${moduleName} Refresh Token unexpected error ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

// Utilized instead of duplicate code
const generateJWT = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id: user.id, roles: user.roles }, {key: key, passphrase: process.env.PRIVATE_KEY_PW}, { algorithm: 'RS256' }, function(err, token) {
            if (err) {
                reject(err);
            }
            resolve(token);
          });
    });
};
