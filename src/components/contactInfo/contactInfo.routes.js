const controller = require('./contactInfo.controller');
const router = require('express').Router();

const apiLimiter = require('../../middlewares/rateLimiter');
const { errorHandler, asyncErrHandler } = require('../../error');

module.exports = (app) => {
    app.use(apiLimiter);

    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    router.put('/', asyncErrHandler(controller.updateContactInfo));

    router.delete('/:id', asyncErrHandler(controller.deleteContactInfo));

    app.use('/api/resources/contact-info', router);

    app.use(errorHandler);
};
