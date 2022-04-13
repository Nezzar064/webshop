const db = require('../index');
const logger = require('../../utils/logger.js');
const OrderItem = db.orderItem;

const moduleName = 'orderItem.repository.js -';

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

exports.delete = async (orderId, id) => {
    try {
        const deletedOrderItem = await OrderItem.destroy({
            where: {
                id: id,
                orderId: orderId,
            }
        });

        if (deletedOrderItem !== 1) {
            logger.info(`${moduleName} orderItem to delete not found id: ${id}, orderId ${orderId}`);
            return;
        }

        logger.info(`${moduleName} delete orderItem by orderId success, id: ${id}, orderId ${orderId}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete orderItem ${JSON.stringify(err)}`);
        return;
    }
};


