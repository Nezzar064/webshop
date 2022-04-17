const controller = require('./product.controller');
const service = require('./product.service');
const model = require('./product.model');
const routes = require('./product.routes');
const repository = require('./product.repository');

module.exports = {
    controller,
    service,
    model,
    routes,
    repository
};