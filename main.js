let express = require("express");
// шаблонизатор
let ect = require("ect");
// модуль отправки писем
let nodemailer = require("nodemailer");
let fs = require("fs");

let app = express();
let ectRenderer = ect({
  root: __dirname + "/html",
  ext : ".html"});

// статические файлы
app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
app.use('/js', express.static('js'));
app.use('/media', express.static('media'));

// подключение шаблонизатора ECT
app.set("view engine", "ect");
app.set("views", "./html");
app.engine("html", ectRenderer.render);

if(app.get("env") === "development") {
  // отключение кэширования для вьюх
  ectRenderer.options.cache = false;
  // подключение livereload
  app.use(require("connect-livereload")());
}

// получение конфига приложения
var config = JSON.parse(fs.readFileSync("env_" + app.get("env") + ".json", "utf8"));
// маршрутизация
// главная
app.use(require("./backend/routing").appRouter);
// app.get("/", (req, res) => {
//   var model = {
//     title: "Психология и бизнес",
//     path: req.path
//   };
//   res.render("index.html", model);
// });
// о компании
app.get("/about", (req, res) => {
  var model = {
    title: "О компании",
    path: req.path,
    year: new Date().getFullYear()
  };
  res.render("about.html", model);
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
// 500
app.use((err, req, res, next) => {
  res.status(500).render("500.html");
});
// 404
app.use((req, res, next) => { res.status(404).render("404.html"); });

app.listen(8205, function () {
});
