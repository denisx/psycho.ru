import * as express from "express";
// шаблонизатор
import * as ect from "ect";
// модуль отправки писем
import * as nodemailer from "nodemailer"
// файловая система
import * as fs from "fs"

let app = express();
let ectRenderer = ect({
  root: __dirname + "/views",
  ext : ".ect"});

// работа со статическими файлами в media
app.use('/media', express.static('media'));
// работа со статическими файлами в css
app.use('/css', express.static('css'));
// работа со статическими файлами в js
app.use('/js', express.static('js'));
// работа со статическими файлами в js
app.use('/fonts', express.static('fonts'));
// подключение шаблонизатора ECT
app.set("view engine", "ect");
app.engine("ect", ectRenderer.render);

if(app.get("env") === "development") {
  console.log("Server run in development mode");
  // отключение кэширования для вьюх
  ectRenderer.options.cache = false;
  // подключение livereload
  app.use(require("connect-livereload")());
}

// получение конфига приложения
var config = JSON.parse(fs.readFileSync("config_" + app.get("env") + ".json", "utf8"));

// маршрутизация
// главная
app.get("/", (req, res) => {
  var model = {
    title: "Психология и бизнес",
    path: req.path
  };
  res.render("index", model);
});
// о компании
app.get("/about", (req, res) => {
  var model = {
    title: "О компании",
    path: req.path,
    year: new Date().getFullYear()
  };
  res.render("about", model);
});
// заявка на продукт или событие
app.get("/callme", (req, res) => {
  console.log(req.query);
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
  res.end();
});
// 404
app.use((req, res, next) => {
  res.status(404).render("404");
});
// 500
app.use((req, res, next) => {
  res.status(500).render("500");
});

app.listen(8205, function () {
});
