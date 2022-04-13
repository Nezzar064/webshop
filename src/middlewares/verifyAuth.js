const jwt = require('jsonwebtoken');
const fs = require('fs');
const { TokenExpiredError, JsonWebTokenError } = jwt;

const getToken = require('../utils/getToken');
const logger = require('../../auth/utils/logger');
const publicKey = fs.readFileSync('public-key.pem');

const moduleName = 'jwt.js -';

// JWT Verification
const verifyToken = (includeRoles) => {
    return async (req, res, next) => {
        try {
            const token = getToken(req);

            // Return 403 if token is not provided
            if (!token) {
                logger.error(`${moduleName} no token provided`);
                res.status(403).send({ message: 'No token was provided' });
                return;
            }

            // Verify token
            const decoded = await jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            if (!decoded) {
                logger.error(`${moduleName} token is invalid`);
                res.status(401).send({ message: 'Token not valid - Unauthorized!' });
                return;
            }

            // Include roles used for guards
            if (includeRoles) {
                req.roles = decoded.roles;
            }

            logger.info(`${moduleName} Token successfully verified, invoking guards`);
            return next();
            
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                logger.error(`${moduleName} access token is expired`);
                res.status(401).send({ message: 'Access token was expired - Unauthorized!' });
                return;
            }
            else if (err instanceof JsonWebTokenError) {
                logger.error(`${moduleName} access token not valid`);
                res.status(401).send({ message: 'Access token not valid - Unauthorized!' });
                return;
            }
            logger.error(`${moduleName} unexpected error validating token ${JSON.stringify(err)}`);
            return res.status(500).end();
        }
    };
};
    

// Admin guard
adminGuard = async (req, res, next) => {
    try {

        for (let i = 0; i < req.roles.length; i++) {
            if (req.roles[i].name === 'admin') {
                logger.debug(`${moduleName} adminGuard / user authorized to access this resource`);
                next();
                return;
            }
        }
        logger.debug(`${moduleName} adminGuard / user not authorized to access this resource`);
        res.status(403).send({ message: 'Admin role required - Unauthorized!' });
        return;

    } catch (err) {
        logger.error(`${moduleName} error verifying admin guard ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

// Mod guard
modGuard = async (req, res, next) => {
    try {

        for (let i = 0; i < req.roles.length; i++) {
            if (req.roles[i].name === 'moderator') {
                logger.debug(`${moduleName} modGuard / user authorized to access this resource`);
                next();
                return;
            }
        }
        logger.debug(`${moduleName} modGuard / user not authorized to access this resource`);
        res.status(403).send({ message: 'Moderator role required - Unauthorized!' });
        return;

    } catch (err) {
        logger.error(`${moduleName} error verifying mod guard ${JSON.stringify(err)}`);
        return res.status(500).end();
    }
};

const verifyAuth = {
    verifyToken,
    adminGuard,
    modGuard,
};

module.exports = verifyAuth;