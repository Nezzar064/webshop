const db = require('../db/index');
const User = require('../db/models/user.model');
const logger = require('../utils/logger');

const moduleName = 'signupVerification.js -';

signupValidator = async (req, res, next) => {
    try {
        logger.info(`${moduleName} validate signup-request/uname & email ${JSON.stringify(req.body)}`);

        //Check if username is duplicated
        const userByUsername = await User.findOne({ username: req.body.username }).exec();
        if (userByUsername) {
            logger.error(`${moduleName} verify username - username already in use ${JSON.stringify(req.body.username)}`);
            res.status(400).send({ message: 'Username already in use!' });
            return;
        }

        const userByEmail = await User.findOne({ email: req.body.email }).exec();
        if (userByEmail) {
            logger.error(`${moduleName} verify email - email already in use ${JSON.stringify(req.body.email)}`);
            res.status(400).send({ message: 'Email already in use!' });
            return;
        }

        next();

    } catch (err) {
        logger.error(`${moduleName} verify username/email unexpected error ${JSON.stringify(err)}`);
        res.status(500).send({ message: err });
        return;
    }
};


checkIfRolesExist = (req, res, next) => {
    logger.info(`${moduleName} validate signup-request/roles ${JSON.stringify(req.body)}`);

    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!db.ROLES.includes(req.body.roles[i])) {
                logger.error(`${moduleName} verify roles - role does not exist: ${JSON.stringify(req.body.roles[i])}`);
                res.status(400).send({ message: `Role: ${req.body.roles[i]} does not exist!` });
                return;
            }
        }
    }
    next();
};


const signupVerification = {
    signupValidator,
    checkIfRolesExist
};

module.exports = signupVerification;
