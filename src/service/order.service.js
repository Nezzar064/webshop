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
            date: new Date(),
            totalPrice: calculateTotalPrice(body.orderItems)
        }
        
        if (user) {
            orderToCreate.user = user;
        }

        const order = await orderRepo.create(orderToCreate);

        const itemsToCreate = body.orderItems.map(item => {
            const container = {
                name: item.name,
                quantity: item.quantity,
                productId: item.productId,
                orderId: order.id,
            };
            return container;
        });
        
        const items = await orderItemRepo.create(itemsToCreate);

        if (!order && !items) {
            return { message: 'Failed to process order!' };
        }

        return ({...order, items});

    } catch (err) {
        logger.error(`${moduleName} unexpected error on create order ${JSON.stringify(err)}`);
        return;
    }
};

// Helper func. used for calculating total price when placing an order
const calculateTotalPrice = (orderItems) => {
    let price = orderItems.forEach(item => {
        price =+ item.quantity * item.price;
    });
    return price.toFixed(2);
}

exports.deleteOrder = async (id) => {
    try {
        // First delete order items
        const deletedItems = await orderItemRepo.deleteByOrderId(id);

        // Then order
        const deletedOrder = await orderRepo.deleteById(id);

        if (!deletedItems && !deletedOrder) {
            logger.error(`${moduleName} failed to delete order, id: ${id}`);
            return { message: 'Failed to delete order!' };
        }

        logger.error(`${moduleName} deleted order, id: ${id}`);
        return { message: 'Order successfully deleted' };

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete order ${JSON.stringify(err)}`);
        return;
    }
}