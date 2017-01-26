var config = require(`${process.cwd()}/config.json`);

exports.render = (req, res, next) => {
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
  mail.sendSendFromRobot(config.managerEmail, subject, message);
  res.end();
}