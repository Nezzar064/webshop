const db = require('../../config/db.config');

const OrderItem = db.sequelize.define('orderItems', {
    name: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Name cannot be empty!'
            }
        },
    },
    price: {
        type: db.dataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                args: true,
                msg: 'Price must be a number!'
            },
            notEmpty: {
                args: true,
                msg: 'Price cannot be empty'
            }
        },
    },
    quantity: {
        type: db.dataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                args: true,
                msg: 'Quantity must be a number!'
            },
            notEmpty: {
                args: true,
                msg: 'Quantity cannot be empty'
            }
        },
    },
    productId: {
        type: db.dataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                args: true,
                msg: 'Product Id must be a number!'
            }
        }
    },
});

module.exports = OrderItem;


