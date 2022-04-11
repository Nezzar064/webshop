const auth = require('../middlewares/verifyAuth');
const controller = require('../controllers/verification.controller');
const router = require('express').Router();

// verifyToken: true/false indicates if roles are included + next()

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    router.get('/token/verify', auth.verifyToken(false), controller.verifyToken);

    router.get('/guards/admin/verify',
    [
        auth.verifyToken(true),
        auth.adminGuard
    ],
    controller.verifyTokenWithAdminGuard
    );

    router.get('/guards/mod/verify',
    [
        auth.verifyToken(true),
        auth.modGuard
    ],
    controller.verifyTokenWithModGuard
    );

    app.use('/api/auth/verification', router);
};
