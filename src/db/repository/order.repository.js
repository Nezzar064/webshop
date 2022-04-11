const db = require('../index');
const logger = require('../../utils/logger.js');
const OrderItem = db.orderItem;
const ContactInfo = db.contactInfo;
const Order = db.order;
const OrderItemAssoc = db.OrderItemAssoc;
const ContactInfoAssoc = db.ContactInfoAssoc;

const moduleName = 'order.repository.js -';

exports.create = async (order) => {
    try {
        const _order = await Order.create({
            date: order.date,
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
            include: [OrderItemAssoc, ContactInfoAssoc]
        });

        if (!_order) {
            logger.info(`${moduleName} create order no response from db`);
            return;
        }

        const result = {
            order: _order.get({ plain: true }),
            orderItems: _order.orderItems.map(item => item.get({ plain: true})),
            contactInfo: _order.contactInfo.get({ plain: true}),
        }

        return result;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create order ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAll = async () => {
    try {
        const orders = await Order.findAll({
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
            raw: true,
            nested: true,
        });

        if (!orders) {
            logger.info(`${moduleName} no orders present in db`);
            return;
        }

        const converted = orders.map(order => order.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on findAll items ${JSON.stringify(err)}`);
        return;
    }
};

exports.update = async (id, order) => {
    try {
        const _order = await Order.update({
            status: order.status,
            name: order.name,
            address: order.address,
            email: order.email,
            zip: order.zip,
            totalPrice: order.totalPrice,
            user: order.user,
        }, {
            where: {
                id: id
            }
        });
        
        if (!_order) {
            logger.error(`${moduleName} order to update not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} updated order with id ${id}: ${JSON.stringify(order)}`);
        return _order.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} order update error: ${JSON.stringify(err)}`);
        return;
    }
};

exports.updateStatus = async (id, status) => {
    try {
        const order = await Order.update({
            status: status,
        }, {
            where: {
                id: id
            }
        });

        if (!order) {
            logger.error(`${moduleName} order to update not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} updated order status with id ${id}: ${JSON.stringify(order)}`);
        return order.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} order update status error: ${JSON.stringify(err)}`);
        return;
    }
}

exports.findById = async (id) => {
    try {
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
            raw: true,
            nested: true,
        });

        if (!order) {
            logger.info(`${moduleName} order ${id} not present in db`);
            return;
        }

        logger.info(`${moduleName} retrieved order by id: ${id} | ${JSON.stringify(order)}`);
        return order.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find order by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAllByUserId = async (user) => {
    try {
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
            raw: true,
            nested: true,
        });

        if (!orders) {
            logger.info(`${moduleName} order ${id} not present in db`);
            return;
        }

        logger.info(`${moduleName} retrieved orders by user: ${user}`);
        const converted = orders.map(order => order.get({ plain: true }));
        return converted;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find order by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.deleteById = async (id) => {
    try {
        const deletedOrder = await Order.destroy({
            where: {
                id: id
            }
        });

        if (deletedOrder !== 1) {
            logger.info(`${moduleName} order and orderItems to delete not found id: ${id}`);
            return;
        }

        logger.info(`${moduleName} delete order success, id: ${id}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete order: ${JSON.stringify(err)}`);
        return;
    }
};
