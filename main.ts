import * as express from "express";
// шаблонизатор
import * as ect from "ect";

let app = express();
let ectRenderer = ect({
  root: __dirname + "/views",
  ext : ".ect",
  // кэширование должно быть отключено только для режима отладки,
  // а не глобально!
  cache: false });

// подключение шаблонизатора ECT
app.set("view engine", "ect");
app.engine("ect", ectRenderer.render);
// подключение livereload,
// должно быть только для режима отладки, а не глобально
app.use(require('connect-livereload')());

// маршрутизация
// главная
app.get("/", (req, res) => {
  var model = { title: "Психология и бизнес" };
  res.render("index", model);
});
// о компании
app.get("/about", (req, res) => {
  res.render("about");
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
