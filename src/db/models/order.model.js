module.exports = (sequelize, DataTypes) => {
    return sequelize.define('orders', {
        status: {
            type: DataTypes.ENUM('PENDING', 'PROCESSING', 'CANCELLED', 'COMPLETED'),
            defaultValue: 'PENDING',
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
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
};


