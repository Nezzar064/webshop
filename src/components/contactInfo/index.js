const controller = require('./contactInfo.controller');
const service = require('./contactInfo.service');
const model = require('./contactInfo.model');
const routes = require('./contactInfo.routes');
const repository = require('./contactInfo.repository');

module.exports = {
    controller,
    service,
    model,
    routes,
    repository
};