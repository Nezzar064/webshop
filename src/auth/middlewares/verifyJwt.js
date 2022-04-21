const jwt = require('jsonwebtoken');
const fs = require('fs');

const {getToken} = require('../helpers');
const {logger} = require('../helpers/log');
const {AppError} = require("../error");
const publicKey = fs.readFileSync('public-key.pem');

const moduleName = 'verifyJwt.js -';

// JWT Verification
module.exports.verifyToken = () => {
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

        req.userId = decoded._id;

        logger.info(`${moduleName} Token successfully verified`);
        return next();
    };
};