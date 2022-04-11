const orderItemRepo = require('../db/repository/orderItem.repository');
const logger = require('../utils/logger');

const moduleName = 'orderItem.service.js -';

exports.findAllByOrderId = async (orderId) => {
    try {

        const orderItems = await orderItemRepo.findAllByOrderId(orderId);

        if(!orderItems) {
            logger.error(`${moduleName} find all orderItems by order id no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found order items order id: ${id}`);
        return orderItems;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find all order items by order id ${JSON.stringify(err)}`);
        return;
    }
};

exports.findById = async (id) => {
    try {

        const orderItem = await orderItemRepo.findById(id);

        if(!orderItem) {
            logger.error(`${moduleName} find order item by id no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found order item by id: ${id}`);
        return orderItem;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find order item by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.delete = async (id) => {
    try {

        const deleted = await orderItemRepo.deleteById(id);

        if(!deleted) {
            logger.error(`${moduleName} delete order item no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully deleted order item by id: ${id}`);
        return deleted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete order item by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.deleteByOrderId = async (orderId) => {
    try {

        const deleted = await orderItemRepo.deleteByOrderId(orderId);

        if(!deleted) {
            logger.error(`${moduleName} delete order item by orderId no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully deleted order item by order id: ${id}`);
        return deleted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete order item by orderId ${JSON.stringify(err)}`);
        return;
    }
};