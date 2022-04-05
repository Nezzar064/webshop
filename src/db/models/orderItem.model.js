module.exports = (sequelize, DataTypes) => {
    const orderItem = sequelize.define('orderItems', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        product: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    });

    return orderItem;
};


