var gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,gls = require('gulp-live-server');

// применение глобального конфига TypeSCript
var tsconfig = gulpts.createProject("tsconfig.json");
// константы с путями и глобавми
var dirDebug = "./debug";
var dirViews = "/views";
var globTS = ["./*.ts"];
var globViews = ["./views/**"];

// сборка TypeScript
gulp.task("ts", function() {
  return gulp.src(globTS)
    .pipe(tsconfig())
    .pipe(gulp.dest(dirDebug));
});

// сборка вьюх ECT
gulp.task("views", function() {
  return gulp.src(globViews)
    .pipe(gulp.dest(dirDebug + dirViews));
});

// компиляция того, что нужно компилировать
gulp.task("compile", ["ts", "views"]);

// режим отладки: компиляция всего, запуск сервера с livereload для статики
gulp.task("debug", ["compile"], function() {
  // инстанс сервера
  var server = gls('main.js', {
    cwd: dirDebug,
    env: {NODE_ENV: 'development'}
  });
  // запуск
  server.start();
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
