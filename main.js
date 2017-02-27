let express = require("express");
let ect = require("ect"); // шаблонизатор
let bodyParser = require('body-parser');
let passport = require('passport');
let flash = require('connect-flash');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let app = express();

app.use(express.static('frontend'));  // статические файлы
app.use(bodyParser.json()); // автопарсер json-а в теле запросов
app.use(bodyParser.urlencoded({extended: true}));  // to support URL-encoded bodies
app.use(cookieParser());

app.use(session({
	cookie: { maxAge: 60000 },
	secret: 'woot',
	resave: false,
	saveUninitialized: false}
));

app.use(flash());
app.use(require('./backend/urls/admin/libs/passport')); // using lib strategy local to authorization

// initialize session
app.use(passport.initialize());
app.use(passport.session());

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
app.use(require('./backend/urls/admin/routes')); // routing admin panel

app.use((err, req, res, next) => {  // 500
  if(app.get("env") === "development") {
    res.status(500).render(err);
  }
  else {
    res.status(500).render("500.html");
  }
});
// 404
app.use((req, res, next) => { res.status(404).render("404.html"); });

app.listen(8105, function () {
});
