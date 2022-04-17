const orderItemService = require("./orderItem.service");
const {logger} = require("../../helpers/log");

const moduleName = 'orderItem.controller.js -';

exports.deleteOrderItem = async (req, res) => {
    const deleted = await orderItemService.delete(req.params.orderId, req.params.id);

    logger.info(`${moduleName} successfully deleted order item id: ${req.params.id}, orderId ${req.params.orderId}`);
    return res.status(200).send(deleted);
};

exports.findAllOrderItemsByOrderId = async (req, res) => {
    const orderItems = await orderItemService.findAllByOrderId(req.params.orderId);

    logger.info(`${moduleName} successfully found order items by order id ${req.params.orderId}`);
    return res.status(200).send(orderItems);
};

exports.findOrderItemById = async (req, res) => {
    const orderItem = await orderItemService.findById((req.params.id));

    logger.info(`${moduleName} successfully found order item ${req.params.id}`);
    return res.status(200).send(orderItem);
};