const guards = require('../middlewares/guards');
const controller = require('../controllers/verification.controller');
const verifyToken = require('../middlewares/jwt');
const router = require('express').Router();

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post('/token/verify', verifyToken, controller.verifyTokenWithNoGuard);

    router.post('/guards/admin/verify',
    [
        guards.verifyTokenWithGuard,
        guards.adminGuard
    ],
    controller.verifyTokenWithAdminGuard
    );

    router.post('/guards/mod/verify',
    [
        guards.verifyTokenWithGuard,
        guards.modGuard
    ],
    controller.verifyTokenWithModGuard
    );

    app.use('/api/auth/verification', router);
};
