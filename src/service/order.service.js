const orderRepo = require('../db/repository/order.repository');
const productService = require('./product.service');
const sendEmail = require('../utils/mailer');
const db = require("../db");
const {AppError} = require("../error");

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

    // Default order status is pending, set by model
    const orderToCreate = {
        contactInfo: body.contactInfo,
        date: new Date(),
        totalPrice: calculateTotalPrice(body.orderItems),
        orderItems: body.orderItems,
    };

    if (body.user) {
        orderToCreate.user = body.user;
    }

    const order = await orderRepo.create(orderToCreate, transaction);
    const updatedStock = await productService.updateStock(order.orderItems, transaction);

    if (!order || !updatedStock) {
        await transaction.rollback();
        throw new AppError('Failed to create order!', 500, true);
    }

    await transaction.commit();

    // Send email to email entered in checkout
    await sendEmail(order.contactInfo.email, `Your order: ${order.id}`, emailHtml(order));

    return order;
};

// Helper func. used for calculating total price when placing an order
const calculateTotalPrice = (orderItems) => {
    let price = 0;
    orderItems.forEach(item => {
        price += item.quantity * item.price;
    });
    return price.toFixed(2);
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
    return await orderRepo.updateStatus(id, status);
};

exports.findAllByUserId = async (userId) => {
    return await orderRepo.findAllByUserId(userId);
};