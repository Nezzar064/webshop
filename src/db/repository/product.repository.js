const db = require('../index');
const logger = require('../../utils/logger.js');
const Product = db.product;

const moduleName = 'product.repository.js -';

exports.create = async (product) => {
    try {
        const _product = await Product.create({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
        });

        if (!_product) {
            logger.info(`${moduleName} create product no response from db`);
            return;
        }

        logger.debug(`${moduleName} created product ${JSON.stringify(_product)}`);

        return _product.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create product ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAll = async () => {
    try {
        const products = await Product.findAll({});

        if (!products) {
            logger.info(`${moduleName} no products present in db`);
            return;
        }

        logger.debug(`${moduleName} found all products succesfully`);

        const converted = products.map(product => product.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on findAll items ${JSON.stringify(err)}`);
        return;
    }
};

exports.update = async (id, product) => {
    try {
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

        if (!_product) {
            logger.error(`${moduleName} product to update not found id: ${id}`);
            return;
        }

        logger.debug(`${moduleName} updated product, id ${id}: ${JSON.stringify(_product)}`);
        return _product.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} product update error: ${JSON.stringify(err)}`);
        return;
    }
};

exports.findById = async (id) => {
    try {
        const product = await Product.findByPk(id);

        if (!product) {
            logger.info(`${moduleName} product ${id} not present in db`);
            return;
        }

        logger.debug(`${moduleName} retrieved product by id: ${id} | ${JSON.stringify(product)}`);
        return product.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find product by id ${JSON.stringify(err)}`);
        return;
    }
};

//Maybe not needed after all
/*
exports.getProductPricesByIds = async (ids) => {
    try {
        const productPrices = await Product.findAll({
            attributes: ['price'],
            where: {
                id: ids,
            },
        }, {});

        if (!productPrices) {
            logger.info(`${moduleName} product ${id} not present in db`);
            return;
        }

        logger.debug(`${moduleName} retrieved product price by id: ${id} | ${JSON.stringify(product)}`);
        const converted = productPrices.map(price => price.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find product price by id ${JSON.stringify(err)}`);
        return;
    }
};
 */

exports.updateStock = async (ids, itemsForUpdate, trx) => {
    try {
        const productStocks = await Product.findAll({
            attributes: ['id', 'stock'],
            where: {
                id: ids,
            }
        });

        if (!productStocks) {
            logger.error(`${moduleName} failed to update product stock`);
            return;
        }

        const updates = productStocks.map(product => {
            itemsForUpdate.forEach(item => {
                if (product.id === item.productId) {
                    product.stock = product.stock - item.quantity;

                    return Product.update({
                            stock: product.stock,
                        }, {
                            where: {
                                id: product.id
                            },
                            transaction: trx
                        });
                }
                return;
            });
        });

        const updated = await Promise.all(updates);

        if (!updated) {
            logger.error(`${moduleName} failed to update product stock`);
            return;
        }

        logger.debug(`${moduleName} updated product stock by ids: ${JSON.stringify(ids)}`);

        // product.service checks for this return
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update stock, rolling back ${JSON.stringify(err)}`);
        return;
    }
};

exports.delete = async (id) => {
    try {
        const deleted = await Product.destroy({
            where: {
                id: id
            }
        });

        if (deleted !== 1) {
            logger.info(`${moduleName} product to delete not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} delete product success, id: ${id}`);
        return { message: 'Product deleted successfully' };

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete product: ${JSON.stringify(err)}`);
        return;
    }
};
