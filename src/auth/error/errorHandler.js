const {logger} = require('../helpers/log');
const {TokenExpiredError, JsonWebTokenError} = require("jsonwebtoken");

const moduleName = 'errorHandler.js -';

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || err;

    if (process.env.NODE_ENV === 'production') {
        return handleErr(err, res, true);
    }
    return handleErr(err, res, false);
};

const handleErr = (err, res, production) => {
    if (err instanceof TokenExpiredError) {
        logger.error(`${moduleName} access token is expired`);
        res.status(401).json({ message: 'Access token was expired - Unauthorized!' });
        return;
    }
    else if (err instanceof JsonWebTokenError) {
        logger.error(`${moduleName} access token not valid`);
        res.status(401).json({ message: 'Access token not valid - Unauthorized!' });
        return;
    }
    if (!production) {
        logger.error(`${moduleName} ${JSON.stringify({status: err.status, error: err, message: err.message})}`);
        handleNotOperationalErr(err);
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    handleNotOperationalErr(err);
    return res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
    });
};

const handleNotOperationalErr = (err) => {
    if (!err.isOperational) {
        logger.error(`${moduleName} Fatal error occurred, restarting auth server... ${JSON.stringify(err)}`);
        return process.exit(1);
    }
};
