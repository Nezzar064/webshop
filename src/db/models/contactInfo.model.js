module.exports = (sequelize, DataTypes) => {
    const contactInfo = sequelize.define('contactInfo', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
                validate: {
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
    });

    return contactInfo;
};