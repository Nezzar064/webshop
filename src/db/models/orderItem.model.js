module.exports = (sequelize, DataTypes) => {
    return sequelize.define('orderItems', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                msg: 'Name cannot be empty!'
            },
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                msg: 'Price cannot be empty / Must be a number!'
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                msg: 'Quantity cannot be empty / Must be a number!'
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                msg: 'Product Id must be a number!'
            }
        },
    });
};


