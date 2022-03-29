const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PSQL_DB, process.env.PSQL_USER, process.env.PSQL_PW, {
    host: process.env.PSQL_HOST,
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

db.order.hasMany(db.product, {
    as: 'products',
});

db.product.belongsTo(db.order, {
    foreignKey: 'orderId',
    as: 'products'
});

module.exports = db;
