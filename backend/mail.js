let nodemailer = require("nodemailer"),
  fs = require("fs");

var proto = module.exports = {
  send: function() {
    var config = JSON.parse(fs.readFileSync(__dirname + "/env_" + require("express")().get("env") + ".json", "utf8"));

    var smtpConfig = {
      service: "Yandex",
      auth: {
          user: config.emailRobot.user,
          pass: config.emailRobot.pass
      }
    };
    var transporter = nodemailer.createTransport(smtpConfig);
    var mailOptions = {
      from: '"Психология и бизнес" <robot@psycho.ru>',
      to: 'p.menshih@gmail.com',
      subject: 'Заявка на обратный звонок',
      html: '<b>Hello world ?</b>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  }
};