const signupVerification = require('../middlewares/signupVerification');
const verifySignIn = require('../middlewares/verifySignIn');
const controller = require('../controllers/auth.controller');
const pwController = require('../controllers/password.controller');
const router = require('express').Router();

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post('/sign-up',
    [
        signupVerification.signupValidator,
        signupVerification.checkIfRolesExist
    ],
    controller.signUp
    );

    router.post('/pw-reset', pwController.pwResetEmailGen);
    router.post('/pw-reset/:id/:token', pwController.pwReset);

    router.post('/sign-in', verifySignIn, controller.signIn);

    router.post('/refresh-token', controller.refreshToken);

    app.use('/api/auth', router);
};
