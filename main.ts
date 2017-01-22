import * as express from "express";
import * as ect from "ect";

let app = express();
let ectRenderer = ect({ root: __dirname + "/views", ext : ".ect" });

// подключение шаблонизатора ECT
app.set("view engine", "ect");
app.engine("ect", ectRenderer.render);

// маршрутизация
// главная
app.get("/", (req, res) => {
  res.render("index");
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

app.listen(3000, function () {
});
