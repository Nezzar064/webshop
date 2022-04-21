const nodemailer = require('nodemailer');
const {mail_logger} = require('../log');
const {AppError} = require("../../error");

const moduleName = 'mailer.js -';

// Define options for sending email
const transporter = nodemailer.createTransport({
    host: process.env.AUTH_MAIL_HOST,
    //service: process.env.MAIL_SERVICE,
    port: process.env.AUTH_MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.AUTH_MAIL_USER,
        pass: process.env.AUTH_MAIL_PW
    },
});

module.exports.sendEmail = async (email, subject, html) => {
    // Send the email
    mail_logger.info(`${moduleName} subject: ${subject} email sent to ${email}`);
    await transporter.sendMail({
        from: process.env.AUTH_MAIL_USER,
        to: email,
        subject: subject,
        html: html
    })
    .catch((err) => {
        mail_logger.error(`${moduleName} subject: ${subject} email unexpected error ${JSON.stringify(err)}`);
        return new AppError(`Could not send mail to user!`, 500, true);
    });
};

