const logger = require('../utils/logger');
const {ValidationError} = require("sequelize");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || err;

    if (process.env.NODE_ENV === 'production') {
        return handleErr(err, res, true);
    }
    return handleErr(err, res, false);
};

const handleErr = (err, res, production) => {
    if (err instanceof ValidationError) {
        const errors = err.errors.map(error => {
            return {
                message: error.message,
                model: error.path,
                givenValue: error.value,
            };
        });
        return res.status(err.statusCode).json(errors);
    }
    if (!production) {
        logger.error(`Error Handler: ${JSON.stringify({status: err.status, error: err, message: err.message})}`);
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    return res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
    });
};
