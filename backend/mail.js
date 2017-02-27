/**
 * Модуль для работы с электронной почтой и письмами
 */
'use strict';
const nodemailer = require('nodemailer');

var proto = module.exports = {
  /**
   * Отправка письма с ящика robot
   * @param {any} to кому
   * @param {any} subject тема
   * @param {any} message текст
   */
  sendFromRobot: function(to, subject, message) {
    var smtpConfig = {
      service: 'Yandex',
      auth: {
          user: process.env.PSYCHO_MAIL_USER,
          pass: process.env.PSYCHO_MAIL_PASS
      }
    };
    var mailOptions = {
      from: process.env.PSYCHO_MAIL_FROM,
      to: to,
      subject: subject,
      html: message
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    // письмо отправляем асинхронно и ничего не возвращаем,
    // есть смысл улучшить логику в будущем
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log('error', error);
        }
    });
  }
};