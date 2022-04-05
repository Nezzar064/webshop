const fetch = require('node-fetch');
const logger = require('../../auth/utils/logger');
const moduleName = 'authorizeJwt.js -';



const verifyJwt = async (req, res, next) => {

    const url = `${process.env.AUTH_PROD_BASE}/verification` | `${AUTH_BASE}/verification/token/verify`;

    try {
        await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${req.headers.authorization}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if (!data) {
                logger.error(`${moduleName} verification failed for request ${JSON.stringify(req.protocol + '://' + req.get('host') + req.originalUrl)}`);
                res.status(401).send({message: 'Authorization failed!'});
                return;
            }
        });  
        next();
    } catch (err) {
        logger.error(`${moduleName} unexpected error while contacting auth server ${JSON.stringify(err)}`);
        res.status(500).end();
    }
};

// do admin guard

// do auth guard