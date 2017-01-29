/**
 * Модуль для работы с электронной почтой и письмами
 */
"use strict";
var nodemailer = require("nodemailer");
var config = require(`${process.cwd()}/config.json`);

var proto = module.exports = {
  /**
   * Отправка письма с ящика robot
   * @param {any} to кому
   * @param {any} subject тема
   * @param {any} message текст
   */
  sendSendFromRobot: function(to, subject, message) {
    var smtpConfig = {
      service: "Yandex",
      auth: {
          user: config.emailRobot.user,
          pass: config.emailRobot.pass
      }
    };
    var mailOptions = {
      from: config.emailRobot.from,
      to: to,
      subject: subject,
      html: message
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    // письмо отправляем асинхронно и ничего не возвращаем, 
    // есть смысл улучшить логику в будущем
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log("error", error);
        }
    });
  }
};