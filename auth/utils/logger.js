const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'info'
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
          level: 'error'
        }),
        /*
        new winston.transports.File({
          filename: 'auth/logs/auth.log',
          format: winston.format.simple(),
          level: 'info'
        }),
        new winston.transports.File({
          filename: 'auth/logs/auth.log',
          format: winston.format.simple(),
          level: 'error'
      }),
      */
    ],
});

module.exports = logger;

/*
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
*/