'use strict';
const nodemailer = require('nodemailer');
const pug = require('pug');

// async..await is not allowed in global scope, must use a wrapper
module.exports.send = async function(template, payload) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'f41d52bfe369e6', // generated ethereal user
            pass: 'f8c2c055b6ac6a' // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" ff93815fa2-dd4068@inbox.mailtrap.io', // sender address
        to: 'ff93815fa2-dd4068@inbox.mailtrap.io', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: pug.renderFile(`views/${template}.pug`, payload) // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
