const express = require("express");
const ect = require("ect"); // шаблонизатор
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// переменная с корнем приложения.
// нужна для придания наглядности путям модулей в require
global.__base = __dirname;

let app = express();

app.use(express.static('frontend'));  // статические файлы
app.use(bodyParser.json()); // автопарсер json-а в теле запросов
app.use(bodyParser.urlencoded({extended: true}));  // to support URL-encoded bodies
app.use(cookieParser());

app.set("views", "./backend/urls"); // пути с html для express
app.set("view engine", "ect");  // включение ect
let ectRenderer = ect({
  root: __dirname + "/backend/urls",
  ext : ".html"});
app.engine("html", ectRenderer.render); // назначение ECT на HTML

if(app.get("env") === "development") {
  ectRenderer.options.cache = false;  // отключение кэширования для вьюх
  app.use(require("connect-livereload")()); // подключение livereload
}

app.use(require("./backend/seoRedirector").seoRedirector);  // 301 и прочее SEO
app.use('/admin/hash', require(__base + '/backend/urls/admin/hash'));
app.use('/admin/auth', require(__base + '/backend/urls/admin/auth'));
app.use('/admin/library', require(__base + '/backend/urls/admin/library_admin'));
app.use(require("./backend/routing").appRouter);  // маршрутизация

app.use((err, req, res, next) => {  // 500
  console.error(e);
  if(app.get("env") === "development") {
    res.status(500).render(err);
  }
  else {
    res.status(500).render("500.html");
  }
});
app.use((req, res, next) => {
  if(res.locals.tplUrl) {
    res.locals.year = new Date().getFullYear();
    res.render(res.locals.tplUrl);
  }
  else next();
});
// 404
app.use((req, res, next) => { res.status(404).render("404.html"); });

app.listen(8105, function () {
});
