const controller = require('./orderItem.controller');
const service = require('./orderItem.service');
const model = require('./orderItem.model');
const routes = require('./orderItem.routes');
const repository = require('./orderItem.repository');

module.exports = {
    controller,
    service,
    model,
    routes,
    repository
};