module.exports = (sequelize, DataTypes) => {
    return sequelize.define('products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
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
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });
};


