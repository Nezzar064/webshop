const orderService = require('./order.service');
const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");

const moduleName = 'order.controller.js -';


exports.createOrder = async (req, res, next) => {

    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const created = await orderService.createOrder(req.body);

    if (!created) {
        logger.error(`${moduleName} failed to create order`);
        return next(new AppError('Failed to create order!', 500, true));
    }

    logger.info(`${moduleName} successfully created order ${JSON.stringify(created)}`);
    return res.status(201).send(created);

};

exports.deleteOrder = async (req, res, next) => {

    const deleted = await orderService.deleteOrder(req.params.id);

    if (!deleted) {
        logger.error(`${moduleName} failed to delete order`);
        return next(new AppError('Failed to delete order!', 500, true));
    }

    logger.info(`${moduleName} successfully deleted order ${JSON.stringify(req.params.id)}`);
    return res.status(200).send(deleted);

};

exports.findAllOrders = async (req, res, next) => {

    const orders = await orderService.findAll();

    if (!orders) {
        logger.error(`${moduleName} failed to find all orders`);
        return next(new AppError('Failed to find orders!', 500, true));
    }

    logger.info(`${moduleName} successfully found all orders`);
    return res.status(200).send(orders);

};

exports.findOrderById = async (req, res, next) => {

    const order = await orderService.findById((req.params.id));

    if (!order) {
        logger.error(`${moduleName} failed to find order`);
        return next(new AppError('Failed to find order!', 500, true));
    }

    logger.info(`${moduleName} successfully found order ${req.params.id}`);
    return res.status(200).send(order);

};

exports.updateOrder = async (req, res, next) => {

    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const updated = await orderService.update(req.params.id, req.body);

    if (!updated) {
        logger.error(`${moduleName} failed to update order`);
        return next(new AppError('Failed to update order!', 500, true));
    }

    logger.info(`${moduleName} successfully updated order ${req.params.id}`);
    res.status(200).send(updated);

};

exports.updateOrderStatus = async (req, res, next) => {
    const updated = await orderService.updateStatus(req.params.id, req.params.status);

    if (!updated) {
        logger.error(`${moduleName} failed to update order status`);
        return next(new AppError('Failed to update order status!', 500, true));
    }

    logger.info(`${moduleName} successfully updated order status ${req.params.id}, ${req.params.status}`);
    res.status(200).send(updated);
};

exports.findAllOrdersByUserId = async (req, res, next) => {
    const orders = await orderService.findById((req.params.userId));

    if (!orders) {
        logger.error(`${moduleName} failed to find all orders by user`);
        return next(new AppError('Failed to find orders by user!', 500, true));
    }

    logger.info(`${moduleName} successfully found orders for user id ${req.params.userId}`);
    return res.status(200).send(orders);
};