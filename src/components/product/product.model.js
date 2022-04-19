const db = require('../../config/db.config');

const Product = db.sequelize.define('products', {
        name: {
            type: db.dataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Name cannot be empty'
                },
            },
        },
        description: {
            type: db.dataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Description cannot be empty'
                },
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
                    msg: 'Price cannot be empty!'
                },
            },
        },
        stock: {
            type: db.dataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Stock must be a number!'
                },
                notEmpty: {
                    args: true,
                    msg: 'Stock cannot be empty!'
                },
                min: {
                    args: [0],
                    msg: 'Stock cannot be below zero!',
                },
            },
        },
        category: {
            type: db.dataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Category cannot be empty!'
                },
            },
        },
});

module.exports = Product;


