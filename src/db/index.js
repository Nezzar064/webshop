const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PSQL_DB, process.env.PSQL_USER, process.env.PSQL_PW, {
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    dialect: 'postgres',
    operatorsAliases: 0,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};

db.product = require('./models/product.model')(sequelize, Sequelize);
db.order = require('./models/order.model')(sequelize, Sequelize);
db.orderItem = require('./models/orderItem.model')(sequelize, Sequelize);
db.contactInfo = require('./models/contactInfo.model')(sequelize, Sequelize);

db.sequelize = sequelize;


const OrderItemAssoc = db.order.hasMany(db.orderItem, {
    foreignKey: 'orderId',
    as: 'orderItems'
});


const ContactInfoAssoc = db.order.hasOne(db.contactInfo, {
    foreignKey: 'orderId',
    as: 'contactInfo'
});

db.ContactInfoAssoc = ContactInfoAssoc;
db.OrderItemAssoc = OrderItemAssoc;

module.exports = db;
