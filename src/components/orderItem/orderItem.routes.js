const controller = require('./orderItem.controller');
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

    router.delete('/:id', asyncErrHandler(controller.deleteOrderItem));

    router.get('/:id', asyncErrHandler(controller.findOrderItemById));

    router.get('/order/:orderId', asyncErrHandler(controller.findAllOrderItemsByOrderId));

    app.use('/api/resources/contact-info', router);

    app.use(errorHandler);
};
