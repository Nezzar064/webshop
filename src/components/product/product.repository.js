const {logger} = require('../../helpers/log');
const Product = require('./product.model');

const {AppError} = require("../../error");

const moduleName = 'product.repository.js -';

exports.create = async (product) => {
    const _product = await Product.create({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
    });

    if (_product[0] === 0) {
        logger.error(`${moduleName} create product no response from db / db error`);
        throw new AppError(`Create product failed`, 500, true);
    }

    logger.debug(`${moduleName} created product ${JSON.stringify(_product)}`);

    return _product.get({plain: true});
};

exports.findAll = async () => {
    const products = await Product.findAll({});

    if (!products || products.length === 0) {
        logger.error(`${moduleName} no products present in db / db error`);
        throw new AppError('No products present in DB!', 404, true);
    }

    logger.debug(`${moduleName} found all products successfully`);

    return products.map(product => product.get({plain: true}));
};

exports.update = async (id, product) => {
    const _product = await Product.update({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
    }, {
        where: {
            id: id
        }
    });

    if (_product[0] === 0) {
        logger.error(`${moduleName} product to update not found id: ${id} / db error`);
        throw new AppError(`Product ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} updated product, id ${id}: ${JSON.stringify(_product)}`);
    return {message: `Product ${id} successfully updated!`};
};

exports.findById = async (id) => {
    const product = await Product.findByPk(id);

    if (!product) {
        logger.error(`${moduleName} product ${id} not present in db / db error`);
        throw new AppError(`Product ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} retrieved product by id: ${id} | ${JSON.stringify(product)}`);
    return product.get({plain: true});
};

exports.updateStockOnCreateOrder = async (ids, itemsForUpdate, transaction) => {
    const productStocks = await Product.findAll({
        attributes: ['id', 'stock'],
        where: {
            id: ids,
        }
    });

    if (!productStocks || productStocks.length === 0) {
        logger.error(`${moduleName} failed to fetch products on update product stock`);
        return false;
    }

    const updates = [];

    productStocks.forEach(product => {
        itemsForUpdate.forEach(async (item) => {
            if (product.id !== item.productId) return;
            product.stock -= item.quantity;

            updates.push(Product.update({
                stock: product.stock,
            }, {
                where: {
                    id: product.id
                },
                transaction
            }));
        });
    });

    const updated = await Promise.all(updates).catch(async () => { return null;});

    if (!updated || updated.length === 0) {
        logger.error(`${moduleName} failed to update product stock`);
        return false;
    }

    logger.debug(`${moduleName} updated product stock by ids: ${JSON.stringify(ids)}`);

    // product.service checks for this return
    return true;
};

exports.updateStock = async (id, stock) => {
    const product = await Product.update({
        stock: stock,
    }, {
        where: {
            id: id
        }
    });

    if (product[0] === 0) {
        logger.error(`${moduleName} product to update stock not found id: ${id}`);
        throw new AppError(`Product ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} updated product stock with id ${id}: ${JSON.stringify(product)}`);
    return {message: `Product ${id} stock successfully updated! New stock: ${stock}`};
};

exports.delete = async (id) => {
    const deleted = await Product.destroy({
        where: {
            id: id
        }
    });

    if (deleted !== 1) {
        logger.error(`${moduleName} product to delete not found id: ${id}`);
        throw new AppError(`Product ${id} not found!`, 404, true);
    }

    logger.info(`${moduleName} delete product success, id: ${id}`);
    return {message: `Product ${id} successfully deleted!`};
};
