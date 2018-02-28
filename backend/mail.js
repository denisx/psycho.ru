/**
 * Модуль для работы с электронной почтой и письмами
 */
'use strict';
const nodemailer = require('nodemailer');

let proto = module.exports = {
  /**
   * Отправка письма с ящика robot
   * @param {any} to кому
   * @param {any} subject тема
   * @param {any} message текст
   */
  sendFromRobot: function(to, subject, message) {
    let smtpConfig = {
      auth: {
        pass: process.env.PSYCHO_MAIL_PASS,
        user: process.env.PSYCHO_MAIL_USER,
      },
      service: 'Yandex',
    };
    let mailOptions = {
      from: process.env.PSYCHO_MAIL_FROM,
      html: message,
      subject: subject,
      to: to,
    };

    let transporter = nodemailer.createTransport(smtpConfig);
    // письмо отправляем асинхронно и ничего не возвращаем,
    // есть смысл улучшить логику в будущем
    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        console.error('error', error);
      }
    });
  }
};
