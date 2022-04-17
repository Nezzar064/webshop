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

    logger.info(`${moduleName} successfully created order ${JSON.stringify(created)}`);
    return res.status(201).send(created);

};

exports.deleteOrder = async (req, res) => {

    const deleted = await orderService.deleteOrder(req.params.id);

    logger.info(`${moduleName} successfully deleted order ${JSON.stringify(req.params.id)}`);
    return res.status(200).send(deleted);

};

exports.findAllOrders = async (req, res) => {

    const orders = await orderService.findAll();

    logger.info(`${moduleName} successfully found orders`);
    return res.status(200).send(orders);

};

exports.findOrderById = async (req, res) => {

    const order = await orderService.findById((req.params.id));

    logger.info(`${moduleName} successfully found order ${req.params.id}`);
    return res.status(200).send(order);

};

exports.updateOrder = async (req, res, next) => {

    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const updated = await orderService.update(req.params.id, req.body);

    logger.info(`${moduleName} successfully updated order ${req.params.id}`);
    res.status(200).send(updated);

};

exports.updateOrderStatus = async (req, res) => {
    const updated = await orderService.update(req.params.id, req.params.status);

    logger.info(`${moduleName} successfully updated order status ${req.params.id}, ${req.params.status}`);
    res.status(200).send(updated);
};

exports.findAllOrdersByUserId = async (req, res) => {
    const orders = await orderService.findById((req.params.userId));

    logger.info(`${moduleName} successfully found orders for user id ${req.params.userId}`);
    return res.status(200).send(orders);
};