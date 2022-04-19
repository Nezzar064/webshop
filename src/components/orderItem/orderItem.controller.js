const orderItemService = require("./orderItem.service");
const {logger} = require("../../helpers/log");
const {AppError} = require("../../error");

const moduleName = 'orderItem.controller.js -';

exports.deleteOrderItem = async (req, res, next) => {

    if (req.params.status.toUpperCase() !== 'PENDING') {
        return next(new AppError('Cannot remove order item due to order status!', 400, true));
    } else if (req.params.status.toUpperCase() !== 'PENDING' && !req.roles.includes('ADMIN') || !req.roles.includes('MODERATOR')) {
        return next(new AppError('Cannot remove order item due to order status and missing roles!', 400, true));
    }

    const deleted = await orderItemService.delete(req.params.orderId, req.params.id);

    if (!deleted) {
        logger.error(`${moduleName} failed to delete order item`);
        return next(new AppError('Failed to delete order item!', 500, true));
    }

    logger.info(`${moduleName} successfully deleted order item id: ${req.params.id}, orderId ${req.params.orderId}`);
    return res.status(200).send(deleted);
};

exports.findAllOrderItemsByOrderId = async (req, res, next) => {
    const orderItems = await orderItemService.findAllByOrderId(req.params.orderId);

    if (!orderItems) {
        logger.error(`${moduleName} failed to find all order items by order`);
        return next(new AppError('Failed to find order items by order!', 500, true));
    }

    logger.info(`${moduleName} successfully found order items by order id ${req.params.orderId}`);
    return res.status(200).send(orderItems);
};

exports.findOrderItemById = async (req, res, next) => {
    const orderItem = await orderItemService.findById((req.params.id));

    if (!orderItem) {
        logger.error(`${moduleName} failed to find order item`);
        return next(new AppError('Failed to find order item!', 500, true));
    }

    logger.info(`${moduleName} successfully found order item ${req.params.id}`);
    return res.status(200).send(orderItem);
};