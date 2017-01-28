let express = require("express");
let ect = require("ect"); // шаблонизатор
let bodyParser = require('body-parser');

let app = express();

app.use(express.static('frontend'));  // статические файлы
app.use(bodyParser.json()); // автопарсер json-а в теле запросов

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
app.use(require("./backend/routing").appRouter);  // маршрутизация

// 500
app.use((err, req, res, next) => {
  if(app.get("env") === "development") {
    res.status(500).render(err);
  }
  else {
    res.status(500).render("500.html");
  }
});
// 404
app.use((req, res, next) => { res.status(404).render("404.html"); });

app.listen(8205, function () {
});
