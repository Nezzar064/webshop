const orderRepo = require('../db/repository/order.repository');
const logger = require('../utils/logger');
const mailer = require('../utils/mailer');

const moduleName = 'order.service.js -';

// HTML used when creating an order
const emailHtml = (order) => {
    let orderItems = order.orderItems.forEach(item => {
        return `<ul>
                    <li>Product name: ${item.name}</li>
                    <li>Quantity: ${item.quantity}</li>
                    <li>Price: ${item.totalPrice}</li>
                </ul>
                <br>`
    });

    return `<h1>Hello ${order.contactInfo.name}</h1>
    <br>
    <h3>Thank you for placing your order!</h3>
    <br>
    <p>Here you can find some details about your order: </p>
    <br>
    <strong>Order Info</strong>
    <ul>
        <li>Order Id: ${order.id}</li>
        <li>Date: ${order.date}</li>
        <li>Total Price: ${order.totalPrice}</li>
        <li>Status: ${order.status}</li>
    </ul>
    <br>
    <strong>Personal/Shipping Details</strong>
    <ul>
        <li>Name: ${order.contactInfo.name}</li>
        <li>Address: ${order.contactInfo.address}</li>
        <li>Email: ${order.contactInfo.email}</li>
        <li>City: ${order.contactInfo.city}</li>
        <li>Zip: ${order.contactInfo.zip}</li>
    </ul>
    <br>
    ${orderItems}
    <p>Alternatively, if you created an user during checkout,
        you can log on the webshop and check out your order there.
        We will inform you once your order has shipped.
    </p>
    <br>
    <p>Best regards, The Webshop</p>`
}


exports.createOrder = async (body, user) => {
    try {
        // Default order status is pending, set by model
        const orderToCreate = {
            contactInfo: body.contactInfo,
            date: new Date(),
            totalPrice: calculateTotalPrice(body.orderItems),
            orderItems: body.orderItems,
        }
        
        if (user) {
            orderToCreate.user = user;
        }

        const order = await orderRepo.create(orderToCreate);

        if (!order) {
            return { message: 'Failed to process order!' };
        }

        // Send email to email entered in checkout
        await mailer.sendEmail(order.contactInfo.email, `Your order: ${order.id}`, emailHtml);

        return order;

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
        const deletedOrder = await orderRepo.deleteById(id);

        if (!!deletedOrder) {
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

exports.findAll = async () => {
    try {

        const orders = await orderRepo.findAll();

        if(!orders) {
            logger.error(`${moduleName} find all orders no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found all orders`);
        return orders;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find all orders ${JSON.stringify(err)}`);
        return;
    }
};

exports.findById = async (id) => {
    try {

        const order = await orderRepo.findById(id);

        if(!order) {
            logger.error(`${moduleName} find order by id: ${id} no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found order by id: ${id}`);
        return order;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find order by id ${JSON.stringify(err)}`);
        return;
    }
};

exports.update = async (id, order) => {
    try {

        const updated = await orderRepo.update(id, order);

        if(!updated) {
            logger.error(`${moduleName} update order no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully updated order`);
        return updated;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update order ${JSON.stringify(err)}`);
        return;
    }
};

exports.updateStatus = async (id, status) => {
    try {

        const updated = await orderRepo.updateStatus(id, status);

        if(!updated) {
            logger.error(`${moduleName} update order status no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully updated order status`);
        return products;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update order status ${JSON.stringify(err)}`);
        return;
    }
};

exports.findAllByUserId = async (userId) => {
    try {

        const orders = await orderRepo.findAllByUserId(userId);

        if(!orders) {
            logger.error(`${moduleName} find all orders by userId no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully found all orders by userId ${userId}`);
        return orders;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on find all orders by userid ${JSON.stringify(err)}`);
        return;
    }
};