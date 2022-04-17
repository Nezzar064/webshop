const controller = require('./order.controller');
const service = require('./order.service');
const model = require('./order.model');
const routes = require('./order.routes');
const repository = require('./order.repository');

module.exports = {
    controller,
    service,
    model,
    routes,
    repository
};