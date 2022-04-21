const db = require('../../config/db.config');

const ContactInfo = db.sequelize.define('contactInfo', {
    name: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Name cannot be empty!'
            },
        },
    },
    address: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Address cannot be empty!'
            },
        },
    },
    email: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Email cannot be empty!'
            },
        },
    },
    phone: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Phone number cannot be empty!'
            },
        },
    },
    city: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'City cannot be empty!'
            },
        },
    },
    zip: {
        type: db.dataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Zip cannot be empty!'
            }
        },
    },
});

module.exports = ContactInfo;