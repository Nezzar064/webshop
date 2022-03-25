const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken');
const User = require('../db/models/user.model');
const Role = require('../db/models/role.model');
const logger = require('../utils/logger');

const moduleName = 'guards.js -';

// Used for verifying request with guards
verifyTokenWithGuard = (req, res, next) => {
    try {
        let token = getToken(req);

        // Return 403 if token is not provided
        if (!token) {
            logger.error(`${moduleName} no token provided`);
            res.status(403).send({ message: 'No token was provided' });
            return;
        }

        // Verify token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                logger.error(`${moduleName} token is invalid ${JSON.stringify(err)}`);
                res.status(401).send({ message: 'Token not valid - Unauthorized!' });
                return;
            }
            if (decoded) {
                logger.info(`${moduleName} Token successfully verified`);
                req.userId = decoded.id;
                console.log(decoded.id);
                next();
            }
        });

    } catch (err) {
        logger.error(`${moduleName} error validating token ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

// Admin guard
adminGuard = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            logger.error(`${moduleName} adminGuard find user error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    logger.error(`${moduleName} adminGuard find roles error ${JSON.stringify(err)}`);
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        logger.debug(`${moduleName} adminGuard user authorized to access this resource`);
                        next();
                        return;
                    }
                }
                logger.debug(`${moduleName} adminGuard user not authorized to access this resource`);
                res.status(403).send({ message: 'Admin role required - Unauthorized!' });
                return;
            }
        );
    });
};

// Mod guard
modGuard = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            logger.error(`${moduleName} modGuard find user error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    logger.error(`${moduleName} modGuard find roles error ${JSON.stringify(err)}`);
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'moderator') {
                        logger.debug(`${moduleName} modGuard user authorized to access this resource`);
                        next();
                        return;
                    }
                }
                logger.debug(`${moduleName} modGuard user not authorized to access this resource`);
                res.status(403).send({ message: 'Moderator role required - Unauthorized!' });
                return;
            }
        );
    });
};

const jwtUtil = {
    verifyTokenWithGuard,
    adminGuard,
    modGuard,
};

module.exports = jwtUtil;
