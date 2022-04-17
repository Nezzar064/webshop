const db = require('../index');
const logger = require('../../utils/logger.js');
const {AppError} = require("../../error");
const OrderItem = db.orderItem;

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

exports.delete = async (orderId, id) => {
    const deletedOrderItem = await OrderItem.destroy({
        where: {
            id: id,
            orderId: orderId,
        }
    });

    if (deletedOrderItem !== 1) {
        logger.info(`${moduleName} orderItem to delete not found id: ${id}, orderId ${orderId}`);
        throw new AppError(`Order item (id: ${id}, orderId: ${orderId}) not found!`, 404, true);
    }

    logger.debug(`${moduleName} delete orderItem by orderId success, id: ${id}, orderId ${orderId}`);
    return {message: `Order item ${id} successfully deleted!`};
};


