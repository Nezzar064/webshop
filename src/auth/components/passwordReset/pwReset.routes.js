const router = require('express').Router();
const { errorHandler, asyncErrHandler } = require('../../../error');
const controller = require("./password.controller");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 1, // 100 requests per 30 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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
    router.post('/pw-reset/verify/:token', asyncErrHandler(controller.verifyPwResetForm));
    router.post('/pw-reset/:token', asyncErrHandler(controller.pwReset));

    app.use('/api/auth', router);

    app.use(errorHandler);
};
