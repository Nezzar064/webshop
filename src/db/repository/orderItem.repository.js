const db = require('../index');
const logger = require('../../utils/logger.js');
const OrderItem = db.orderItem;

const moduleName = 'orderItem.repository.js -';

exports.create = async (orderItems) => {
    try {
        const _orderItems = await OrderItem.bulkCreate(orderItems);

        if (!_orderItems) {
            logger.info(`${moduleName} create orderItem no response from db`);
            return;
        }

        logger.debug(`${moduleName} created orderItems ${JSON.stringify(_orderItems)}`);

        const converted = _orderItems.map(orderItem => orderItem.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create orderItem ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAllByOrderId = async (orderId) => {
    try {
        const orderItems = await OrderItem.findAll({
            where: {
                orderId: orderId
            }
        });

        if (!orderItems) {
            logger.info(`${moduleName} no orderItems present in db`);
            return;
        }

        logger.debug(`${moduleName} found all orderItems ${JSON.stringify(orderItems)}`);

        const converted = orderItems.map(orderItem => orderItem.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on findAll items ${JSON.stringify(err)}`);
        return;
    }
};

exports.findById = async (id) => {
    try {
        const orderItem = await OrderItem.findByPk(id);

        if (!orderItem) {
            logger.info(`${moduleName} orderItem ${id} not present in db`);
            return;
        }

        logger.debug(`${moduleName} retrieved orderItem by id: ${id} | ${JSON.stringify(orderItem)}`);
        return orderItem.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find orderItem by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.deleteByOrderId = async (orderId) => {
    try {
        const deletedorderItem = await OrderItem.destroy({
            where: {
                orderId: orderId
            }
        });

        if (deletedorderItem !== 1) {
            logger.info(`${moduleName} orderItem to delete by orderId not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} delete orderItem by orderId success, id: ${id}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete orderItem by orderId: ${JSON.stringify(err)}`);
        return;
    }
};

exports.deleteById = async (id) => {
    try {
        const deletedOrderItem = await OrderItem.destroy({
            where: {
                id: id
            }
        });
        
        if (deletedOrderItem !== 1) {
            logger.info(`${moduleName} orderItem to delete not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} delete orderItem success, id: ${id}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete orderItem: ${JSON.stringify(err)}`);
        return;
    }
};

