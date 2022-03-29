const bcrypt = require('bcryptjs');
const User = require('../db/models/user.model');
const logger = require('../utils/logger');


const moduleName = 'verifySignIn.js -';

signInValidator = async (req, res, next) => {
    logger.info(`${moduleName} validate sign-in-request ${JSON.stringify(req.body)}`);

    //Check if username is valid
    await User.findOne({
        username: req.body.username
    })
    .exec()
    .then((user) => {
        if (!user) {
            logger.error(`${moduleName} verify username - username is invalid ${JSON.stringify(req.body.username)}`);
            res.status(400).send({ message: 'Invalid username!' });
            return;
        }

        //Check if password is valid
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).send({
                accessToken: null,
                message: 'Password is invalid!'
            });
            return;
        }

        next();

    })
    .catch((err) => {
        logger.error(`${moduleName} verify username error ${JSON.stringify(err)}`);
        res.status(500).send({ message: err });
        return;
    });
};

module.exports = signInValidator;