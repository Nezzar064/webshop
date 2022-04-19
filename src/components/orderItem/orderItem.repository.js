const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");
const OrderItem = require('./orderItem.model');

const moduleName = 'orderItem.repository.js -';

exports.findAllByOrderId = async (orderId) => {
    const orderItems = await OrderItem.findAll({
        where: {
            orderId: orderId
        }
    });

    if (!orderItems) {
        logger.info(`${moduleName} no orderItems present in db`);
        throw new AppError(`No order items belonging to ${orderId} present in DB!`, 404, true);
    }

    logger.debug(`${moduleName} found all orderItems ${JSON.stringify(orderItems)}`);

    return orderItems.map(orderItem => orderItem.get({plain: true}));

};

exports.findById = async (id) => {
    const orderItem = await OrderItem.findByPk(id);

    if (!orderItem) {
        logger.info(`${moduleName} orderItem ${id} not present in db`);
        throw new AppError(`Order item ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} retrieved orderItem by id: ${id} | ${JSON.stringify(orderItem)}`);
    return orderItem.get({plain: true});

};

exports.findQuantityAndProductIdById = async (id) => {
    const orderItem = await OrderItem.findByPk(id, {
        attributes: ['id', 'quantity', 'productId']
    });

    if (!orderItem) {
        logger.info(`${moduleName} orderItem ${id} not present in db`);
        throw new AppError(`Order item ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} retrieved orderItem quantity and product id by id: ${id} | ${JSON.stringify(orderItem)}`);
    return orderItem.get({plain: true});

};

exports.delete = async (orderId, id, transaction) => {
    const deletedOrderItem = await OrderItem.destroy({
        where: {
            id: id,
            orderId: orderId,
        },
        transaction
    });

    if (deletedOrderItem !== 1) {
        logger.info(`${moduleName} orderItem to delete not found id: ${id}, orderId ${orderId}`);
        return false;
    }

    logger.debug(`${moduleName} delete orderItem by orderId success, id: ${id}, orderId ${orderId}`);
    return true;
};


