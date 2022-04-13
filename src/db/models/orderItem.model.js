module.exports = (sequelize, DataTypes) => {
    return sequelize.define('orderItems', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        price: {
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
        productId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    });
};


