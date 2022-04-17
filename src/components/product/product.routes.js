const controller = require('./product.controller');
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

    router.post('/', asyncErrHandler(controller.createProduct));

    router.delete('/:id', asyncErrHandler(controller.deleteProduct));

    router.get('/', asyncErrHandler(controller.findAllProducts));

    router.get('/:id', asyncErrHandler(controller.findProductById));

    router.put('/:id', asyncErrHandler(controller.updateProduct));

    app.use('/api/resources/products', router);

    app.use(errorHandler);
};
