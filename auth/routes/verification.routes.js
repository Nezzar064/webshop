const guards = require('../middlewares/guards');
const controller = require('../controllers/verification.controller');
const verifyToken = require('../middlewares/jwt');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/verification/verify-token', verifyToken, controller.verifyTokenWithNoGuard);

    app.post('/verification/guards/admin-guard',
    [
        guards.verifyTokenWithGuard,
        guards.adminGuard
    ],
    controller.verifyTokenWithAdminGuard
    );

    app.post('/verification/guards/mod-guard',
    [
        guards.verifyTokenWithGuard,
        guards.modGuard
    ],
    controller.verifyTokenWithModGuard
    );
};
