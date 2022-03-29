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