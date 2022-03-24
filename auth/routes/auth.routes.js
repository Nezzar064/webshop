const signupVerification = require('../middlewares/signupVerification');
const controller = require('../controllers/auth.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Bearer, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/signup',
    [
        signupVerification.signupValidator,
        signupVerification.checkIfRolesExist
    ],
    controller.signUp
    );

    app.post('/signin', controller.signIn);

    app.post('/refresh-token', controller.refreshToken);
};
