const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");
const { model: OrderItem } = require('../orderItem');
const { model: ContactInfo } = require('../contactInfo');
const { Order, OrderItemAssoc, ContactInfoAssoc } = require('./order.model');

const moduleName = 'order.repository.js -';

exports.create = async (order, transaction) => {
    const _order = await Order.create({
        dateTime: order.dateTime,
        totalPrice: order.totalPrice,
        user: order.user,
        orderItems: order.orderItems,
        contactInfo: {
            name: order.contactInfo.name,
            address: order.contactInfo.address,
            email: order.contactInfo.email,
            city: order.contactInfo.city,
            zip: order.contactInfo.zip
        }
    }, {
        include: [OrderItemAssoc, ContactInfoAssoc],
        transaction
    });

    if (!_order) {
        logger.info(`${moduleName} create order no response from db`);
        await transaction.rollback();
        return;
    }

    return _order.get({plain: true});
};

exports.findAll = async () => {
    const orders = await Order.findAll({
        include: [{
            model: OrderItem,
            as: 'orderItems',
            attributes: ['id', 'name', 'price', 'quantity']
        },
            {
                model: ContactInfo,
                as: 'contactInfo',
                attributes: ['id', 'name', 'address', 'email', 'city', 'zip']
            }
        ],
        nested: true,
    });

    if (!orders || orders.length === 0) {
        logger.info(`${moduleName} no orders present in db`);
        throw new AppError('No orders present in DB!', 404, true);
    }

    return orders;
};

exports.update = async (id, order) => {
    const _order = await Order.update({
        status: order.status,
        dateTime: order.dateTime,
        totalPrice: order.totalPrice,
        user: order.user,
    }, {
        where: {
            id: id
        }
    });

    if (!_order) {
        logger.error(`${moduleName} order to update not found id: ${id}`);
        throw new AppError(`Order ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} updated order with id ${id}: ${JSON.stringify(order)}`);
    return {message: `Order ${id} successfully updated!`};
};

exports.updateStatus = async (id, status) => {
    const order = await Order.update({
        status: status,
    }, {
        where: {
            id: id
        }
    });

    if (order[0] === 0) {
        logger.error(`${moduleName} order to update not found id: ${id}`);
        throw new AppError(`Order ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} updated order status with id ${id}: ${JSON.stringify(order)}`);
    return {message: `Order ${id} status successfully updated! New status: ${status}`};
};

exports.findById = async (id) => {
    const order = await Order.findByPk(id, {
        include: [{
            model: OrderItem,
            as: 'orderItems',
            attributes: ['id', 'name', 'totalPrice', 'quantity']
        },
            {
                model: ContactInfo,
                as: 'contactInfo',
                attributes: ['id', 'name', 'address', 'email', 'city', 'zip']
            }
        ],
        nested: true,
    });

    if (!order) {
        logger.info(`${moduleName} order ${id} not present in db`);
        throw new AppError(`Order ${id} not found!`, 404, true);
    }

    logger.debug(`${moduleName} retrieved order by id: ${id} | ${JSON.stringify(order)}`);
    return order;

};

exports.findAllByUserId = async (user) => {
    const orders = await Order.findAll({
        where: {
            user: user
        },
        include: [{
            model: OrderItem,
            as: 'orderItems',
            attributes: ['id', 'name', 'totalPrice', 'quantity']
        },
            {
                model: ContactInfo,
                as: 'contactInfo',
                attributes: ['id', 'name', 'address', 'email', 'city', 'zip']
            }
        ],
        nested: true,
    });

    if (!orders || orders.length === 0) {
        logger.info(`${moduleName} Orders belonging to ${user} not present in db`);
        throw new AppError(`Orders belonging to User ${user} not found!`, 404, true);
    }

    logger.debug(`${moduleName} retrieved orders by user: ${user}`);
    return orders;

};

exports.deleteById = async (id) => {
        const deletedOrder = await Order.destroy({
            where: {
                id: id
            }
        });

        if (deletedOrder !== 1) {
            logger.info(`${moduleName} order and orderItems to delete not found id: ${id}`);
            throw new AppError(`Order ${id} not found!`, 404, true);
        }

        logger.debug(`${moduleName} delete order success, id: ${id}`);
        return {message: `Order ${id} successfully deleted!`};
};
