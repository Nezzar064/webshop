const db = require('../db/index');
const User = require('../db/models/user.model');
const logger = require('../utils/logger');

const moduleName = 'signupVerification.js -';

signupValidator = async (req, res, next) => {
    logger.info(`${moduleName} validate signup-request/uname & email ${JSON.stringify(req.body)}`);

    //Check if username is duplicated
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            logger.error(`${moduleName} verify username error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err});
            return;
        }
        if (user) {
            logger.error(`${moduleName} verify username - username already in use ${JSON.stringify(user.username)}`);
            res.status(400).send({ message: 'Username already in use!'});
            return;
        }
    });

    //Check if username is duplicated
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            logger.error(`${moduleName} verify email error ${JSON.stringify(err)}`);
            res.status(500).send({ message: err});
            return;
        }
        if (user) {
            logger.error(`${moduleName} verify email - email already in use ${JSON.stringify(user.email)}`);
            res.status(400).send({ message: 'Email already in use!'});
            return;
        }
    });

    await next();
};

checkIfRolesExist = async (req, res, next) => {
    logger.info(`${moduleName} validate signup-request/roles ${JSON.stringify(req.body)}`);

    if (req.body.roles) {
        req.body.roles.forEach(role => {
            if (!db.ROLES.includes(role)) {
                res.status(400).send({message: `${role} does not exist!`});
            }
        });
        return;
    }
    await next();
};

const signupVerification = {
    signupValidator,
    checkIfRolesExist
};

module.exports = signupVerification;
