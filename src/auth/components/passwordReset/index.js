const Token = require('./pwToken.model');
const controller = require('./password.controller');
const routes = require('./pwReset.routes');

module.exports = {
    controller,
    Token,
    routes
};