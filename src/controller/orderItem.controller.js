const orderItemService = require("../service/orderItem.service");
const logger = require("../utils/logger");

const moduleName = 'orderItem.controller.js -';

exports.deleteOrderItem = async (req, res) => {
    try {
        const deleted = await orderItemService.delete(req.params.orderId, req.params.id);

        if (!deleted) {
            logger.error(`${moduleName} failed to delete order item id ${req.params.id}, orderId ${req.params.orderId}`);
            return res.status(500).send({message: `Failed to delete order item`});
        }

        logger.debug(`${moduleName} successfully deleted order item id: ${req.params.id}, orderId ${req.params.orderId}`);
        return res.status(204).send({message: `Order item successfully deleted!`});

    } catch (e) {
        logger.error(`${moduleName} unexpected error during delete order item ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findAllOrderItemsByOrderId = async (req, res) => {
    try {
        const orderItems = await orderItemService.findAllByOrderId(req.params.orderId);

        if (!orderItems) {
            logger.error(`${moduleName} failed to find all order items by order id ${req.params.orderId}`);
            return res.status(404).send({message: `No Order items present on Order ${req.params.orderId}!`});
        }

        logger.debug(`${moduleName} successfully found order items by order id ${req.params.orderId}`);
        return res.status(200).send(orderItems);
    } catch (e) {
        logger.error(`${moduleName} unexpected error during find all order items by order id ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findOrderItemById = async (req, res) => {
    try {
        const orderItem = await orderItemService.findById((req.params.id));

        if (!orderItem) {
            logger.error(`${moduleName} failed to find order item ${req.params.id}`);
            return res.status(404).send({message: `Order item ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully found order item ${req.params.id}`);
        return res.status(200).send(orderItem);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during find order item by id ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};