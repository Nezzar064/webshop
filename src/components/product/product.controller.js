const productService = require('./product.service');
const {logger} = require('../../helpers/log');
const {AppError} = require('../../error');

const moduleName = 'product.controller.js -';

exports.createProduct = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const created = await productService.createProduct(req.body);

    if (!created) {
        logger.error(`${moduleName} failed to create product`);
        return next(new AppError('Failed to create product!', 500, true));
    }

    logger.info(`${moduleName} successfully created product ${JSON.stringify(created)}`);
    return res.status(201).send(created);

};

exports.deleteProduct = async (req, res, next) => {
    const deleted = await productService.delete(req.params.id);

    if (!deleted) {
        logger.error(`${moduleName} failed to delete product`);
        return next(new AppError('Failed to delete product!', 500, true));
    }

    logger.info(`${moduleName} successfully deleted product ${JSON.stringify(req.params.id)}`);
    return res.status(200).send(deleted);
};

exports.findAllProducts = async (req, res, next) => {
    const products = await productService.findAll();

    if (!products) {
        logger.error(`${moduleName} failed to find all products`);
        return next(new AppError('Failed to find products!', 500, true));
    }

    logger.info(`${moduleName} successfully found all products`);
    return res.status(200).send(products);
};

exports.findProductById = async (req, res, next) => {
    const product = await productService.findById((req.params.id));

    if (!product) {
        logger.error(`${moduleName} failed to find product`);
        return next(new AppError('Failed to find product!', 500, true));
    }

    logger.info(`${moduleName} successfully found product ${req.params.id}`);
    return res.status(200).send(product);
};

exports.updateStock = async (req, res, next) => {
    const updated = await productService.updateStock(req.params.id, req.params.status);

    if (!updated) {
        logger.error(`${moduleName} failed to update product stock`);
        return next(new AppError('Failed to update product stock!', 500, true));
    }

    logger.info(`${moduleName} successfully updated product stock ${req.params.id}, ${req.params.status}`);
    res.status(200).send(updated);
};

exports.updateProduct = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const updated = await productService.updateProduct(req.params.id, req.body);

    if (!updated) {
        logger.error(`${moduleName} failed to update product`);
        return next(new AppError('Failed to update product!', 500, true));
    }

    logger.info(`${moduleName} successfully updated product ${req.params.id}`);
    res.status(200).send(updated);

};
