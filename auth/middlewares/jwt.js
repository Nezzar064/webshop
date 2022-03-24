const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken');
const logger = require('../utils/logger');

const { TokenExpiredError } = jwt;

const moduleName = 'jwt.js -';

const catchRefreshTokenError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        logger.error(`${moduleName} access token is expired`);
        return res.status(401).send({message: 'Access token was expired - Unauthorized!'});
    }
    return res.status(401).send({message: 'Unauthorized!'});
};

// No callback version used for verifying without guards
const verifyToken = async (req, res) => {
    let token = getToken(req);

    // Return 403 if token is not provided
    if (!token) {
        logger.error(`${moduleName} no token provided`);
        return res.status(403).send({ message: 'No token was provided' });
    }

    // Verify token
    await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            logger.error(`${moduleName} token is invalid ${JSON.stringify(err)}`);
            return catchRefreshTokenError(err, res);
        }
        if (decoded) {
            logger.info(`${moduleName} Token successfully verified`);
            res.status(200).send({verified: true});
        }
    })
    .catch((err) => {
        logger.error(`${moduleName} error validating token ${JSON.stringify(err)}`);
        return res.status(401).send({verified: false});
    });
};

module.exports = verifyToken;

