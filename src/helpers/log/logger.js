const winston = require('winston');

module.exports.logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'info'
        }),
        /*
        new winston.transports.File({
          filename: '../../logs/server.log',
          format: winston.format.simple(),
          level: 'info'
        }),
      */
    ],
});

module.exports.auth_logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'info'
        }),
        /*
        new winston.transports.File({
          filename: '../../logs/auth.log',
          format: winston.format.simple(),
          level: 'info'
        })
      */
    ],
});

module.exports.mail_logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'info'
        }),
        /*
        new winston.transports.File({
          filename: '../../logs/mailer.log',
          format: winston.format.simple(),
          level: 'info'
        })
      */
    ],
});


/*
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
*/