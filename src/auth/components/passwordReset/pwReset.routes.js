const router = require('express').Router();
const { errorHandler, asyncErrHandler } = require('../../../error');
const controller = require("./password.controller");
const apiLimiter = require('../../middlewares/rateLimiter');

module.exports = (app) => {
    app.use(apiLimiter);
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post('/pw-reset', asyncErrHandler(controller.pwResetEmailGen));
    router.post('/pw-reset/:id/:token', asyncErrHandler(controller.pwReset));

    app.use('/api/auth', router);

    app.use(errorHandler);
};
