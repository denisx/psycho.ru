/**
 * Модуль отправки менеджеру письма о том, что на сайте был сделан запрос
 * по какому-либо продукту
 */
"use strict";

exports.render = (req, res, next) => {
  // обработка только пост-запросов
  if(req.method != "POST") {
    return res.end();
  }
  let mail = require("../../mail");
  let subject = "Заявка на psycho.ru";
  let message = `
Здравствуйте.
<br/>На сайте сделана заявка на обратный звонок.
<br/>
<br/>Данные пользователя.
<br/>Имя: ${req.body.name}
<br/>Телефон: ${req.body.phone}
<br/>Email: ${req.body.email}
<br/><a href="${req.body.url}">Страница заявки</a>.`;
  // письмо просто отправляем асинхронно без всяких проверок
  mail.sendFromRobot(process.env.PSYCHO_MAIL_MANAGER, subject, message);
  // ответа не будет
  res.end();
}