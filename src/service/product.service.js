const productRepo = require('../db/repository/product.repository');
const logger = require('../utils/logger');

const moduleName = 'product.service.js -';

exports.calculateTotalPrice = async (items) => {
    try {
        const ids = items.map(item => {
            item.id
        });

        const prices = await productRepo.getProductPricesByIds(ids);

        if (!prices) {
            logger.error(`${moduleName} calculate total price no response from db`);
            return;
        }
    
        let totalPrice = 0;
        prices.forEach(price => {
            totalPrice += price;
        });
        
        logger.debug(`${moduleName} calculated total price ${JSON.stringify(totalPrice)}`);
        return totalPrice;
    } catch (err) {
        logger.error(`${moduleName} unexpected error on calculate total price ${JSON.stringify(err)}`);
        return;
    }
};

exports.updateStock = async (items) => {
    try {
        const ids = items.map(item => {
            return item.id
        });

        const updated = await productRepo.updateStock(ids, items);
        
        if(!updated) {
            logger.error(`${moduleName} update stock no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully updated product stock`);

        // Controller runs a check on this
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update stock ${JSON.stringify(err)}`);
        return;
    }
};

exports.createProduct = async (product) => {
    try {

        const createdProduct = await productRepo.create(product);

        if(!createdProduct) {
            logger.error(`${moduleName} create product no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully created product ${createdProduct}`);
        return createdProduct;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create product ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAll = async () => {
    try {

        const products = await productRepo.findAll();

        if(!products) {
            logger.error(`${moduleName} find all products no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found all products`);
        return products;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find all products ${JSON.stringify(err)}`);
        return;
    }
};

exports.updateProduct = async (id, product) => {
    try {

        const updated = await productRepo.update(id, product);

        if(!updated) {
            logger.error(`${moduleName} update product no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully updated product by id: ${id}`);
        return updated;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update product ${JSON.stringify(err)}`);
        return;
    }
};

exports.findById = async (id) => {
    try {

        const foundProduct = await productRepo.findById(id);

        if(!foundProduct) {
            logger.error(`${moduleName} find product by id no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found product by id: ${id}`);
        return foundProduct;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find product by id ${id} ${JSON.stringify(err)}`);
        return;
    }
};

exports.delete = async (id) => {
    try {

        const deleted = await productRepo.delete(id);

        if(!deleted) {
            logger.error(`${moduleName} delete product no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully deleted product by id: ${id}`);
        return deleted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete product ${JSON.stringify(err)}`);
        return;
    }
};