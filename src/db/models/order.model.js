module.exports = (sequelize, DataTypes) => {
    const order = sequelize.define('orders', {
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true,
            },
        },
        status: {
            type: DataTypes.ENUM('PENDING','PROCESSING','CANCELLED','SHIPPED','COMPLETED'),
            defaultValue: 'PENDING',
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        address: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false,
                validate: {
                notEmpty: true,
            },
        },
        totalPrice: {
            type: DataTypes.STRING,
            allowNull: false,
                validate: {
                notEmpty: true,
            },
        },
        user: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return order;
};


