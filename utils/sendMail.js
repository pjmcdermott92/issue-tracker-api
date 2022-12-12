const nodemailer = require('nodemailer');

const sendMail = async options => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    const message = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        //OPTIONAL: Can add HTML
    };

    await transporter.sendMail(message);
}

module.exports = sendMail;
