const Token = require('./pwToken.model');
const controller = require('./passwordReset.controller');
const routes = require('./passwordReset.routes');

module.exports = {
    controller,
    Token,
    routes
};