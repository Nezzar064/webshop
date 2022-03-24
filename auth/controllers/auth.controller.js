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
    await user.save((err, user) => {
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
                async (err, roles) => {
                    if (err) {
                        logger.error(`${moduleName} find roles unexpected error ${JSON.stringify(err)}`);
                        res.status(500).send({ message: err });
                        return;
                    }
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
                }
            );
        
        // Else defaulting to user role
        } else {
            logger.debug(`${moduleName} using default user role for signup`);
            Role.findOne({ name: "user" }, async (err, role) => {
                if (err) {
                    logger.error(`${moduleName} find role unexpected error ${JSON.stringify(err)}`);
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                await user.save(err => {
                    if (err) {
                        logger.error(`${moduleName} save user (default role) unexpected error ${JSON.stringify(err)}`);
                        res.status(500).send({ message: err });
                        return;
                    }
                    logger.info(`${moduleName} user successfully saved using default role (user) ${JSON.stringify(err)}`);
                    res.status(200).send({ message: "User successfully signed up!" });
                });
            });
        }
    });
};

exports.signIn = (req, res) => {
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
      
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                accessToken: null,
                message: 'Password is invalid!'
            });
        }

        let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        let refreshToken = await RefreshToken.createRefreshToken();

        let roles = [];
        user.roles.forEach(role => {
            roles.push(`ROLE_${role.name.toUppercase()}`);
        });
        
        logger.info(`${moduleName} user successfully authenticated ${JSON.stringify(user)}`);

        res.status(200).send({
            id: user_id,
            username: user.username,
            email: user.email,
            roles: roles,
            accessToken: token,
            refreshToken: refreshToken,
        });
    });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        logger.error(`${moduleName} refreshToken empty body`);
        return res.status(403).send({message: 'Refresh token is required'});
    }

    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            logger.error(`${moduleName} Refresh Token not present in database`);
            res.status(403).send({message: 'Refresh token not present in database'});
            return;
        }

        if (RefreshToken.verifyRtExpiration(refreshToken)) {
            logger.info(`${moduleName} Refresh Token is expired, requested for new login`);

            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false});
            res.status(403).send({message: 'Refresh token is expired, please sign in again.'});
            return;
        }

        let _accessToken = jwt.sign({ id: refreshToken.user._id}, process.env.SECRET_KEY, { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        
        return res.status(200).send({
            accessToken: _accessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        logger.info(`${moduleName} Refresh Token unexpected error ${JSON.stringify(err)}`);
        return res.status(500).send({ message: err });
    }
};
