import * as express from "express";
let app = express();

// каталог шаблонов
app.set("views", "./views");
// подключение шаблонизатора Vash
app.set("view engine", "vash");

app.get('/', function (req, res) {
  res.render("index");
});

app.listen(3000, function () {
});
