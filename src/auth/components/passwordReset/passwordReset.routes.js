const router = require('express').Router();
const {verifyToken} = require('../../middlewares');
const { errorHandler, asyncErrHandler } = require('../../error');
const controller = require("./passwordReset.controller");
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

    router.post('/pw-reset', asyncErrHandler(verifyToken), asyncErrHandler(controller.pwReset));
    router.post('/forgot-pw', asyncErrHandler(controller.forgotPwEmailGen));
    router.post('/forgot-pw/verify/:token', asyncErrHandler(controller.verifyForgotPwForm));
    router.post('/forgot-pw/:token', asyncErrHandler(controller.forgotPwReset));

    app.use('/api/auth', router);

    app.use(errorHandler);
};
