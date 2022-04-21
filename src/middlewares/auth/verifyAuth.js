const jwt = require('jsonwebtoken');
const fs = require('fs');

const {getToken} = require('../../helpers');
const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");
const publicKey = fs.readFileSync('public-key.pem');

const moduleName = 'verifyAuth.js -';

// JWT Verification
module.exports.verifyToken = (includeRoles) => {
    return async (req, res, next) => {
        const token = getToken(req);

        // Return 403 if token is not provided
        if (!token) {
            logger.error(`${moduleName} no token provided`);
            throw new AppError('No token was provided', 403, true);
        }

        // Verify token
        const decoded = await jwt.verify(token, publicKey, {algorithms: ['RS256']});
        if (!decoded) {
            logger.error(`${moduleName} token is invalid`);
            throw new AppError('Token not valid - Unauthorized!', 401, true);
        }

        // Include roles used for guards
        if (includeRoles) {
            req.roles = decoded.roles;
        }
        
        req.userId = decoded._id;

        logger.info(`${moduleName} Token successfully verified, invoking guards`);
        return next();
    };
};


// Admin guard
module.exports.adminGuard = (req, res, next) => {
    for (let i = 0; i < req.roles.length; i++) {
        if (req.roles[i].name === 'admin') {
            logger.debug(`${moduleName} adminGuard / user authorized to access this resource`);
            next();
            return;
        }
    }
    logger.debug(`${moduleName} adminGuard / user not authorized to access this resource`);
    throw new AppError('Admin role required - Unauthorized!', 401, true);
};

// Mod guard
module.exports.modGuard = (req, res, next) => {
    for (let i = 0; i < req.roles.length; i++) {
        if (req.roles[i].name === 'moderator') {
            logger.debug(`${moduleName} modGuard / user authorized to access this resource`);
            next();
            return;
        }
    }
    logger.debug(`${moduleName} modGuard / user not authorized to access this resource`);
    throw new AppError('Admin role required - Unauthorized!', 403, true);
};
