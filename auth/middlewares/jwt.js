const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken');
const logger = require('../utils/logger');

const { TokenExpiredError } = jwt;

const moduleName = 'jwt.js -';

// No callback version used for verifying without guards
const verifyToken = async (req, res) => {
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
                logger.info(`${moduleName} Token successfully verified`);
                res.status(401).send({ verified: false });
            }
            logger.info(`${moduleName} Token successfully verified`);
            res.status(200).send({ verified: true });
        }).catch((err) => {
            if (err instanceof TokenExpiredError) {
                logger.error(`${moduleName} access token is expired`);
                res.status(401).send({ message: 'Access token was expired - Unauthorized!' });
                return;
            }
            logger.error(`${moduleName} error validating token ${JSON.stringify(err)}`);
            return res.status(500).end();
        });
};

module.exports = verifyToken;

