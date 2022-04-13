const productService = require('../service/product.service');
const logger = require('../utils/logger');

const moduleName = 'product.controller.js -';

exports.createProduct = async (req, res) => {
    try {
        if (!req.body) {
            logger.error(`${moduleName} empty body received`);
            return res.status(400).send({message: 'Please provide a body!'});
        }

        const created = await productService.createProduct(req.body);

        if (created.message) {
            logger.error(`${moduleName} error during create product ${JSON.stringify(created.message)}`);
            return res.status(500).send(created);
        }

        logger.debug(`${moduleName} successfully created product ${JSON.stringify(created)}`);
        return res.status(201).send(created);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during create product ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await productService.delete(req.params.id);

        if (!deleted) {
            logger.error(`${moduleName} failed to delete product ${req.params.id}`);
            return res.status(500).send({message: 'Failed to delete product!'});
        }

        logger.debug(`${moduleName} successfully deleted product ${JSON.stringify(req.params.id)}`);
        return res.status(204).send({message: `Product ${req.params.id} successfully deleted!`});

    } catch (e) {
        logger.error(`${moduleName} unexpected error during delete product ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findAllProducts = async (req, res) => {
    try {
        const products = await productService.findAll();

        if (!products) {
            logger.error(`${moduleName} failed to find all products`);
            return res.status(404).send({message: 'No products present!'});
        }

        logger.debug(`${moduleName} successfully found products`);
        return res.status(200).send(products);
    } catch (e) {
        logger.error(`${moduleName} unexpected error during find all products ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findProductById = async (req, res) => {
    try {
        const product = await productService.findById((req.params.id));

        if (!product) {
            logger.error(`${moduleName} failed to find product ${req.params.id}`);
            return res.status(404).send({message: `Product ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully found product ${req.params.id}`);
        return res.status(200).send(product);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during find product by id ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};
// PUT
exports.updateProduct = async (req, res) => {
    try {
        if (!req.body) {
            logger.error(`${moduleName} empty body received`);
            return res.status(400).send({message: 'Please provide a body!'});
        }

        const updated = await productService.updateProduct(req.params.id, req.body);

        if (!updated) {
            logger.error(`${moduleName} failed to update product ${req.params.id}, ${JSON.stringify(req.body)}`);
            return res.status(404).send({message: `Product ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully updated product ${req.params.id}`);
        res.status(204).send(updated);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during update product ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};
