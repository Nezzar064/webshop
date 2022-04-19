const orderRepo = require('./order.repository');
const productService = require('../product/product.service');
const {mailer} = require('../../helpers/mailer');
const db = require("../../config/db.config");
const {AppError} = require("../../error");

// HTML used when creating an order
const emailHtml = (order) => {
    let orderItems = order.orderItems.forEach(item => {
        return `<ul>
                    <li>Product name: ${item.name}</li>
                    <li>Quantity: ${item.quantity}</li>
                    <li>Price: ${item.totalPrice}</li>
                </ul>
                <br>`;
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
    <p>Alternatively, if you created a user during checkout,
        you can log on the webshop and check out your order there.
        We will inform you once your order has shipped.
    </p>
    <br>
    <p>Best regards, The Webshop</p>`;
};


exports.createOrder = async (body) => {
    const transaction = await db.sequelize.transaction();
    const date = new Date();
    let totalPrice = 0;
    // Calculate total price of each order item and add to total price
    const orderItems = body.orderItems.map(item => {
        item.price = item.quantity * item.price;
        totalPrice += item.price;
        return item;
    });

    // Default order status is pending, set by model
    const orderToCreate = {
        contactInfo: body.contactInfo,
        dateTime: `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`,
        totalPrice: totalPrice,
        orderItems: orderItems,
    };

    if (body.user) {
        orderToCreate.user = body.user;
    }

    const order = await orderRepo.create(orderToCreate, transaction);
    const updatedStock = await productService.updateStockOnCreateOrder(order.orderItems, transaction);

    if (!order || !updatedStock) {
        await transaction.rollback();
        throw new AppError('Failed to create order!', 500, true);
    }

    await transaction.commit();

    // Send email to email entered in checkout
    await mailer.sendEmail(order.contactInfo.email, `Your order: ${order.id}`, emailHtml(order));

    return order;
};

exports.deleteOrder = async (id) => {
    return await orderRepo.deleteById(id);
};

exports.findAll = async () => {
    return await orderRepo.findAll();
};

exports.findById = async (id) => {
    return await orderRepo.findById(id);
};

exports.update = async (id, order) => {
    return await orderRepo.update(id, order);
};

exports.updateStatus = async (id, status) => {
    const statusValidation = ['PENDING', 'PROCESSING', 'CANCELLED', 'COMPLETED'];

    if (!statusValidation.includes(status.toUpperCase())) {
        throw new AppError(`Failed to update status - invalid status! ${status}`, 500, true);
    }

    return await orderRepo.updateStatus(id, status.toUpperCase());
};

exports.findAllByUserId = async (userId) => {
    return await orderRepo.findAllByUserId(userId);
};