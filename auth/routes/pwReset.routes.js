const controller = require('../controllers/password.controller');

module.exports = (app) => {
    app.post('/pw-reset', controller.pwResetEmailGen);
    app.post('/pw-reset/:id/:token', controller.pwReset);
};