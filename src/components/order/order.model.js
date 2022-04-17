const db = require('../../config/db.config');
const { model: contactInfo } = require('../contactInfo');
const { model: orderItem } = require('../orderItem');

const order = db.sequelize.define('orders', {
        status: {
            type: db.dataTypes.ENUM('PENDING', 'PROCESSING', 'CANCELLED', 'COMPLETED'),
            defaultValue: 'PENDING',
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        date: {
            type: db.dataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        totalPrice: {
            type: db.dataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        user: {
            type: db.dataTypes.STRING,
            allowNull: true,
        },
});

const OrderItemAssoc = order.hasMany(orderItem, {
    foreignKey: 'orderId',
    as: 'orderItems'
});


const ContactInfoAssoc = order.hasOne(contactInfo, {
    foreignKey: 'orderId',
    as: 'contactInfo'
});

module.exports = {
    Order: order,
    ContactInfoAssoc,
    OrderItemAssoc
};


