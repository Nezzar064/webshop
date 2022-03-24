const nodemailer = require('nodemailer');
const logger = require('./logger');

const moduleName = 'sendEmail.js -';

const sendEmail = async (email, subject, html) => {
    
    // Define options for sending email
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        //service: process.env.MAIL_SERVICE,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PW
        },
    });

    // Send the email
    logger.info(`${moduleName} subject: ${subject} email sent to ${email}`);
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: html
    })
    .catch((err) => {
        logger.error(`${moduleName} subject: ${subject} email unexpected error ${JSON.stringify(err)}`);
    });
};

module.exports = sendEmail;