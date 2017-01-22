var gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,sass = require("gulp-sass")
  ,gls = require('gulp-live-server');

// применение глобального конфига TypeSCript
var tsconfig = gulpts.createProject("tsconfig.json");
// константы с путями и глобами
var dirDebug = "./debug";
var dirViews = "/views";
var dirCss = "/css";
var dirJs = "/js";
var dirFonts = "/fonts";
var dirMedia = "/media";
var globFonts = "./frontend/fonts/*"
var globMedia = "./frontend/media/**/*";
var globSass = "./frontend/sass/*.scss";
var globJs = "./frontend/ts/*.js";
var globTS = ["./*.ts"];
var globViews = ["./views/**"];

// режим отладки: компиляция всего, запуск сервера с livereload для статики
gulp.task("debug", function() {
  // копирование конфига
  gulp.src("./config_development.json")
    .pipe(gulp.dest(dirDebug));
  // копирование шрифтов
  gulp.src(globFonts)
    .pipe(gulp.dest(dirDebug + dirFonts));
  // копирование сторонних js
  gulp.src(globJs)
    .pipe(gulp.dest(dirDebug + dirJs));
  // обработка sass
  gulp.src(globSass)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(dirDebug + dirCss));
  // копирование папки media
  gulp.src(globMedia)
    .pipe(gulp.dest(dirDebug + dirMedia));
  // сборка TypeScript бэкенда
  gulp.src(globTS)
    .pipe(tsconfig())
    .pipe(gulp.dest(dirDebug));
  // сборка вьюх ECT
  gulp.src(globViews)
    .pipe(gulp.dest(dirDebug + dirViews));
  // инстанс сервера
  var server = gls("main.js", {
    cwd: dirDebug,
    env: { NODE_ENV: "development" }
  });
  // запуск
  server.start();
  // вотч для sass
  gulp.watch(globSass, function (event) {
    gulp.src(event.path)
      // просто копируем измененный файл куда нужно
      .pipe(gulp.dest(dirDebug + dirCss))
      // подгружаем изменения в сервер
      .pipe(server.notify());
  });
  // вотч для папки media
  gulp.watch(globMedia, function (event) {
    gulp.src(event.path)
      // просто копируем измененный файл куда нужно
      .pipe(gulp.dest(dirDebug + dirMedia))
      // подгружаем изменения в сервер
      .pipe(server.notify());
  });
  // вотч для вьюх с livereload,
  // работает с измененными файлами, а не директроями целиком
  gulp.watch(globViews, function (event) {
    gulp.src(event.path)
      // просто копируем измененный файл куда нужно
      .pipe(gulp.dest(dirDebug + dirViews))
      // подгружаем изменения в сервер
      .pipe(server.notify());
  });
  // вотч для TS, также работает индивидуально
  gulp.watch(globTS, function(event) {
    gulp.src(event.path)
      // компиляция TS
      .pipe(tsconfig())
      // копирование
      .pipe(gulp.dest(dirDebug))
      // перезагрузка сервера
      .on("finish", server.start.bind(server));
  });
});
