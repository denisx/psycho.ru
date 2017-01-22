import * as express from "express";
// шаблонизатор
import * as ect from "ect";

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
