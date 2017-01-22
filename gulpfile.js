var gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,sass = require("gulp-sass")
  ,environments = require("gulp-environments")
  ,clean = require('gulp-clean')
  ,gls = require('gulp-live-server');

var development = environments.development;
var production = environments.production;

var dirDebug = "./debug";
var dirProd = "./release";
var dirBuild = production() ? dirProd : dirDebug;
var dirCss = "/css";
var dirViews = "/views";
var globStatic = "./frontend/static/**/*";
var globSass = "./frontend/sass/*.scss";
var globViews = ["./views/**"];
var globTS = ["./*.ts"];
// применение глобального конфига TypeSCript
var tsconfig = gulpts.createProject("tsconfig.json");
// константы с путями и глобами

var dirFonts = "/fonts";
var dirMedia = "/media";
var globFonts = "./frontend/fonts/*"
var globMedia = "./frontend/media/**/*";

var globJs = "./frontend/ts/*.js";

gulp.task("clean", function() {
  return gulp.src(dirBuild, {read: false})
    .pipe(clean());
});

gulp.task("static", function() {
  return gulp.src(globStatic)
    .pipe(gulp.dest(dirBuild));
});

gulp.task("sass", function() {
  return gulp.src(globSass)
    .pipe(sass())
    .pipe(gulp.dest(dirBuild + dirCss));
});

gulp.task("ect", function() {
  return gulp.src(globViews)
    .pipe(gulp.dest(dirBuild + dirViews));
});

gulp.task("tsbe", function() {
  return gulp.src(globTS)
    .pipe(tsconfig())
    .pipe(gulp.dest(dirBuild));
});

// режим отладки: компиляция всего, запуск сервера с livereload для статики
gulp.task("debug", function() {
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
