const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user.model');
const Role = require('../db/models/role.model');
const RefreshToken = require('../db/models/RefreshToken.model');
const logger = require('../utils/logger');

const moduleName = 'auth.controller.js';

exports.signUp = (req, res) => {
    logger.info(`${moduleName} request to signup user ${JSON.stringify(req.body)}`);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    });
    try {
        user.save((err, user) => {
            if (err) {
                logger.error(`${moduleName} save user unexpected error ${JSON.stringify(err)}`);
                res.status(500).send({ message: err });
                return;
            }
    
            // Using roles from request body if present
            if (req.body.roles) {
                logger.debug(`${moduleName} using roles from req.body for signup ${JSON.stringify(req.body.roles)}`);
    
                Role.find(
                    {
                        name: { $in: req.body.roles }
                    },
                    (err, roles) => {
                        if (err) {
                            logger.error(`${moduleName} find roles unexpected error ${JSON.stringify(err)}`);
                            res.status(500).send({ message: err });
                            return;
                        }
                        user.roles = roles.map(role => role._id);
                        user.save(err => {
                            if (err) {
                                logger.error(`${moduleName} save user unexpected error ${JSON.stringify(err)}`);
                                res.status(500).send({ message: err });
                                return;
                            }
                            logger.info(`${moduleName} user successfully signed up ${JSON.stringify(user)}`);
                            res.status(200).send({ message: 'User successfully signed up!' });
                        });
                    }
                );
            
            // Else defaulting to user role
            } else {
                logger.debug(`${moduleName} using default user role for signup`);
                Role.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                        logger.error(`${moduleName} find role unexpected error ${JSON.stringify(err)}`);
                        res.status(500).send({ message: err });
                        return;
                    }
                    user.roles = [role._id];
                    user.save(err => {
                        if (err) {
                            logger.error(`${moduleName} save user (default role) unexpected error ${JSON.stringify(err)}`);
                            res.status(500).send({ message: err });
                            return;
                        }
                        logger.info(`${moduleName} user successfully saved using default role (user)`);
                        res.status(200).send({ message: "User successfully signed up!" });
                    });
                });
            }
        });
    } catch (err) {
        logger.error(`${moduleName} unexpected error during sign-up ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

exports.signIn = (req, res) => {
    try {
        User.findOne({
            username: req.body.username
        })
        .populate('roles', '-__v')
        .exec(async (err, user) => {
            if (err) {
                logger.error(`${moduleName} find user (signin) unexpected error ${JSON.stringify(err)}`);
                res.status(500).send({ message: err });
                return;
            }
    
            let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY),
            });
    
            let refreshToken = await RefreshToken.createRefreshToken(user);
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
        });
    } catch (err) {
        logger.error(`${moduleName} unexpected error during sign-in ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        logger.error(`${moduleName} refreshToken empty body`);
        return res.status(403).send({message: 'Refresh token is required'});
    }

    try {
        // Try to find token, send appropiate message if not found
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            logger.error(`${moduleName} Refresh Token not present in database`);
            res.status(403).send({message: 'Refresh token not present in database'});
            return;
        }

        // Verify expiry, if expired, remove it and prompt for new sign-in
        if (RefreshToken.verifyRtExpiration(refreshToken)) {
            logger.info(`${moduleName} Refresh Token is expired, requested for new login`);

            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false});
            res.status(403).send({message: 'Refresh token is expired, please sign in again.'});
            return;
        }

        // Generate new access token
        let _accessToken = jwt.sign({ id: refreshToken.user._id}, process.env.SECRET_KEY, { 
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY),
        });
        
        return res.status(200).send({
            accessToken: _accessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        logger.info(`${moduleName} Refresh Token unexpected error ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};
