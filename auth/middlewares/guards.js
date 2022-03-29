const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken');
const User = require('../db/models/user.model');
const Role = require('../db/models/role.model');
const logger = require('../utils/logger');

const moduleName = 'guards.js -';

// Used for verifying request with guards
verifyTokenWithGuard = async (req, res, next) => {
    let token = getToken(req);

    // Return 403 if token is not provided
    if (!token) {
        logger.error(`${moduleName} no token provided`);
        res.status(403).send({ message: 'No token was provided' });
        return;
    }

    // Verify token
    await jwt.verify(token, process.env.SECRET_KEY)
        .then(decoded => {
            if (!decoded) {
                logger.error(`${moduleName} token is invalid ${JSON.stringify(err)}`);
                res.status(401).send({ message: 'Token not valid - Unauthorized!' });
                return;
            }
            logger.info(`${moduleName} Token successfully verified`);
            req.userId = decoded.id;
            next();
        })
        .catch((err) => {
            if (err instanceof TokenExpiredError) {
                logger.error(`${moduleName} access token is expired`);
                res.status(401).send({ message: 'Access token was expired - Unauthorized!' });
                return;
            }
            logger.error(`${moduleName} error validating token ${JSON.stringify(err)}`);
            return res.status(500).end();
        });
};

// Admin guard
adminGuard = async (req, res, next) => {
    await User.findById(req.userId)
        .exec()
        .then(async (user) => {
            await Role.find(
                {
                    _id: { $in: user.roles }
                },
            )
                .exec()
                .then(roles => {
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
                })
                .catch((err) => {
                    logger.error(`${moduleName} adminGuard find roles error ${JSON.stringify(err)}`);
                    res.status(500).send({ message: err });
                    return;
                });
        })
        .catch((err) => {
            logger.error(`${moduleName} adminGuard find user error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err });
            return;
        });
};

// Mod guard
modGuard = async (req, res, next) => {
    await User.findById(req.userId)
        .exec()
        .then(async (user) => {
            await Role.find(
                {
                    _id: { $in: user.roles }
                },
            )
                .exec()
                .then((roles) => {
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
                })
                .catch((err) => {
                    logger.error(`${moduleName} modGuard find roles error ${JSON.stringify(err)}`);
                    res.status(500).send({ message: err });
                    return;
                });
        })
        .catch((err) => {
            logger.error(`${moduleName} modGuard find user error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err });
            return;
        });
};

const jwtUtil = {
    verifyTokenWithGuard,
    adminGuard,
    modGuard,
};

module.exports = jwtUtil;
