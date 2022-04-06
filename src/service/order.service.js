const orderRepo = require('../db/repository/order.repository');
const orderItemRepo = require('../db/repository/orderItem.repository');
const logger = require('../utils/logger');

const moduleName = 'order.service.js -';


exports.createOrder = async (body, user) => {
    try {
        // Default order status is pending, set by model
        const orderToCreate = {
            name: body.name,
            address: body.address,
            zip: body.zip,
            totalPrice: calculateTotalPrice(body.orderItems)
        }
        

        if (user) {
            orderToCreate.user = user;
        }

        const order = await orderRepo.create(orderToCreate);

        const itemPromises = body.orderItems.map(item => {
            orderItemRepo.create(item, order.id);
        });

        const items = await Promise.all(itemPromises);

        if (!order && !items) {
            return {message: 'Failed to process order!'};
        }

        return ({...order, items});

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create order ${JSON.stringify(err)}`);
    }
};

const calculateTotalPrice = (orderItems) => {
    let price = orderItems.forEach(item => {
        price =+ item.quantity * item.price;
    });
    return price.toFixed(2);
}