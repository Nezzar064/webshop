const controller = require('./order.controller');
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

    router.post('/', asyncErrHandler(controller.createOrder));

    router.delete('/:id', asyncErrHandler(controller.deleteOrder));

    router.get('/', asyncErrHandler(controller.findAllOrders));

    router.get('/:id', asyncErrHandler(controller.findOrderById));

    router.get('/user/:userId', asyncErrHandler(controller.findAllOrdersByUserId));

    router.put('/:id', asyncErrHandler(controller.updateOrder));

    router.patch('/:id/:status', asyncErrHandler(controller.updateOrderStatus));

    app.use('/api/resources/orders', router);

    app.use(errorHandler);
};
