module.exports = (sequelize, DataTypes) => {
    return sequelize.define('products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Name cannot be empty'
                },
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Description cannot be empty'
                },
            },
        },
        price: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
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
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Category cannot be empty!'
                },
            },
        },
    });
};


