const controller = require('../controller/contactInfo.controller');
const router = require('express').Router();

const { errorHandler, asyncErrHandler } = require('../error');

module.exports = (app) => {
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
