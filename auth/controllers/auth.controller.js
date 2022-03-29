const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user.model');
const Role = require('../db/models/role.model');
const RefreshToken = require('../db/models/RefreshToken.model');
const logger = require('../utils/logger');

const moduleName = 'auth.controller.js';

exports.signUp = async (req, res) => {
    logger.info(`${moduleName} request to signup user ${JSON.stringify(req.body)}`);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    });

    await user.save()
        .then(async (user) => {

            // Using roles from request body if present
            if (req.body.roles) {
                logger.debug(`${moduleName} using roles from req.body for signup ${JSON.stringify(req.body.roles)}`);

                await Role.find(
                    {
                        name: { $in: req.body.roles }
                    })
                    .exec()
                    .then(async (roles) => {
                        user.roles = roles.map(role => role._id);
                        await user.save(err => {
                            if (err) {
                                logger.error(`${moduleName} save user unexpected error ${JSON.stringify(err)}`);
                                res.status(500).send({ message: err });
                                return;
                            }
                            logger.info(`${moduleName} user successfully signed up ${JSON.stringify(user)}`);
                            res.status(200).send({ message: 'User successfully signed up!' });
                        });
                    })
                    .catch((err) => {
                        logger.error(`${moduleName} find roles unexpected error ${JSON.stringify(err)}`);
                        res.status(500).send({ message: err });
                        return;
                    });

                // Else defaulting to user role
            } else {
                logger.debug(`${moduleName} using default user role for signup`);
                await Role.findOne({ name: "user" })
                    .exec()
                    .then(async (role) => {
                        user.roles = [role._id];
                        await user.save()
                            .then(() => {
                                logger.info(`${moduleName} user successfully saved using default role (user)`);
                                res.status(200).send({ message: "User successfully signed up!" });
                            })
                            .catch((err) => {
                                logger.error(`${moduleName} save user (default role) unexpected error ${JSON.stringify(err)}`);
                                res.status(500).send({ message: err });
                                return;
                            });
                    })
                    .catch((err) => {
                        logger.error(`${moduleName} find role unexpected error ${JSON.stringify(err)}`);
                        res.status(500).send({ message: err });
                        return;
                    });
            }
        })
        .catch((err) => {
            logger.error(`${moduleName} unexpected error during sign-up ${JSON.stringify(err)}`);
            return res.status(500).end();
        });
};

exports.signIn = async (req, res) => {
    await User.findOne({
        username: req.body.username
    })
        .populate('roles', '-__v')
        .exec()
        .then(async (user) => {
            if (!user) {
                logger.error(`${moduleName} user not present in database`);
                res.status(400).send({ message: 'User could not be found!' });
                return;
            }

            // Create access token upon login
            let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY),
            });

            // Find refresh token if it exists, otherwise create a new one.
            let refreshToken = RefreshToken.findOne({ user: user._id })
                .exec(async (err, refreshToken) => {
                    if (!err) {
                        logger.error(`${moduleName} refresh-token handler error ${JSON.stringify(err)}`);
                        return null;
                    }

                    if (!refreshToken) {
                        logger.info(`${moduleName} created new refresh token for user ${JSON.stringify(user._id)}`);
                        return await RefreshToken.createRefreshToken(user);
                    }
                    logger.info(`${moduleName} returned users existing token ${JSON.stringify(user._id)}`);
                    return refreshToken;
                });
            if (!refreshToken) {
                throw new Error('Refresh Token error');
            }

            let _roles = [];
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
                refreshToken: refreshToken,
            });

        })
        .catch((err) => {
            logger.error(`${moduleName} unexpected error during sign-in ${JSON.stringify(err)}`);
            return res.status(500).end();
        });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        logger.error(`${moduleName} refreshToken empty body`);
        return res.status(403).send({ message: 'Refresh token is required' });
    }

    await RefreshToken.findOne({ token: requestToken })
    .exec()
    .then(async (refreshToken) => {
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

        // Generate new access token
        let _accessToken = jwt.sign({ id: refreshToken.user._id }, process.env.SECRET_KEY, {
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY),
        });

        return res.status(200).send({
            accessToken: _accessToken,
            refreshToken: refreshToken.token,
        });  
    })
    .catch((err) => {
        logger.info(`${moduleName} Refresh Token unexpected error ${JSON.stringify(err)}`);
        return res.status(500).end();
    });
};
