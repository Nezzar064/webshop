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

    logger.info(`${moduleName} successfully created product ${JSON.stringify(created)}`);
    return res.status(201).send(created);

};

exports.deleteProduct = async (req, res) => {
    const deleted = await productService.delete(req.params.id);

    logger.info(`${moduleName} successfully deleted product ${JSON.stringify(req.params.id)}`);
    return res.status(200).send(deleted);
};

exports.findAllProducts = async (req, res) => {
    const products = await productService.findAll();

    logger.info(`${moduleName} successfully found products`);
    return res.status(200).send(products);
};

exports.findProductById = async (req, res) => {
    const product = await productService.findById((req.params.id));

    logger.info(`${moduleName} successfully found product ${req.params.id}`);
    return res.status(200).send(product);
};

exports.updateProduct = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const updated = await productService.updateProduct(req.params.id, req.body);

    logger.info(`${moduleName} successfully updated product ${req.params.id}`);
    res.status(200).send(updated);

};
