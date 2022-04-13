const orderService = require('../service/order.service');
const logger = require('../utils/logger');

const moduleName = 'order.controller.js -';


exports.createOrder = async (req, res) => {
    try {
        if (!req.body) {
            logger.error(`${moduleName} empty body received`);
            return res.status(400).send({message: 'Please provide a body!'});
        }

        const created = await orderService.createOrder(req.body);

        if (created.message) {
            logger.error(`${moduleName} error during create order ${JSON.stringify(created.message)}`);
            return res.status(500).send(created);
        }

        logger.debug(`${moduleName} successfully created order ${JSON.stringify(created)}`);
        return res.status(201).send(created);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during create order ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await orderService.deleteOrder(req.params.id);

        if (!deleted) {
            logger.error(`${moduleName} failed to delete order ${req.params.id}`);
            return res.status(500).send({message: 'Failed to delete order!'});
        }

        logger.debug(`${moduleName} successfully deleted order ${JSON.stringify(req.params.id)}`);
        return res.status(204).send({message: `Order ${req.params.id} successfully deleted!`});

    } catch (e) {
        logger.error(`${moduleName} unexpected error during delete order ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findAllOrders = async (req, res) => {
    try {
        const orders = await orderService.findAll();

        if (!orders) {
            logger.error(`${moduleName} failed to find all orders`);
            return res.status(404).send({message: 'No orders present!'});
        }

        logger.debug(`${moduleName} successfully found orders`);
        return res.status(200).send(orders);
    } catch (e) {
        logger.error(`${moduleName} unexpected error during find all orders ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findOrderById = async (req, res) => {
    try {
        const order = await orderService.findById((req.params.id));

        if (!order) {
            logger.error(`${moduleName} failed to find order ${req.params.id}`);
            return res.status(404).send({message: `Order ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully found order ${req.params.id}`);
        return res.status(200).send(order);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during find order by id ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};
// PUT
exports.updateOrder = async (req, res) => {
    try {
        if (!req.body) {
            logger.error(`${moduleName} empty body received`);
            return res.status(400).send({message: 'Please provide a body!'});
        }

        const updated = await orderService.update(req.params.id, req.body);

        if (!updated) {
            logger.error(`${moduleName} failed to update order ${req.params.id}, ${JSON.stringify(req.body)}`);
            return res.status(404).send({message: `Order ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully updated order ${req.params.id}`);
        res.status(204).send(updated);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during update order ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};
// PATCH
exports.updateOrderStatus = async (req, res) => {
    try {
        const updated = await orderService.update(req.params.id, req.params.status);

        if (!updated) {
            logger.error(`${moduleName} failed to update order status ${req.params.id}, ${req.params.status}`);
            return res.status(404).send({message: `Order ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully updated order status ${req.params.id}, ${req.params.status}`);
        return res.status(204).send(updated);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during update order status ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.findAllOrdersByUserId = async (req, res) => {
    try {
        const orders = await orderService.findById((req.params.userId));

        if (!orders) {
            logger.error(`${moduleName} failed to find orders ${req.params.userId}`);
            return res.status(404).send({message: `No orders exists for user ${req.params.userId}!`});
        }

        logger.debug(`${moduleName} successfully found orders for user id ${req.params.userId}`);
        return res.status(200).send(orders);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during find orders by user id ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};