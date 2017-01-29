let gulp = require("gulp");
let lintSass = require("gulp-sass");
let htmlmin = require('gulp-htmlmin');
let cleanCss = require('gulp-clean-css');
let concatCss = require('gulp-concat-css');
let clean = require('gulp-clean');
let concatJs = require('gulp-concat');
let gulpts = require("gulp-typescript");
let env = require("gulp-environments");
let uglifyJS = require('gulp-uglify');
let gls = require('gulp-live-server');
let exec = require('child_process').exec;

// определение выходной директории в зависимости от среды исполнения
let outDir = env.production() ? "./build/release" : "./build/debug";

gulp.task("rm", function() {  // очистка папки назначения
  return gulp.src(`${outDir}/*`).pipe(clean());
});

gulp.task("sass", ["ts"], function() {  // весь сасс собирается в один бандл и минифицируется
  return gulp.src("./src/frontend/css/*.scss")
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css`));
});

gulp.task("sassold", ["sass"], function() { // сасс со стилями предыдущей версии сайта
  return gulp.src("./src/frontend/css/old/*.scss")
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css/old`));
});

gulp.task("ts", ["copy"], function() {  // ts компилируется и копируется с сохранением вложенности пути
  return gulp.src("./src/**/*.ts")
      .pipe(gulpts.createProject("tsconfig.json")())
      .pipe(gulp.dest(outDir));
});

gulp.task("jsc", ["sassold"], function() {  // js фронтенда собирается в бандл и (для продакшена) минифицируется
  return gulp.src(`${outDir}/frontend/js/*.js`)
    .pipe(concatJs('bundle.js'))
    .pipe(env.production(uglifyJS()))
    .pipe(gulp.dest(`${outDir}/frontend`)); // костыль! кладём бандл в кривую папку
});

gulp.task("jsd", ["jsc"], function() {  // удаление всего js на фронтенда, кроме бандла
  // костыль! таск разбит на 3 части
  // часть 1. очистка папки с исходными скриптами
  return gulp.src(`${outDir}/frontend/js/*.js`)
    .pipe(clean());
});

gulp.task("jsd2", ["jsd"], function() { // костыль! копирование бандла в папку назначения
  return gulp.src(`${outDir}/frontend/bundle.js`)
    .pipe(gulp.dest(`${outDir}/frontend/js`));
});

gulp.task("jsd3", ["jsd2"], function() {  // костыль! удаление бандла из временной папки
  return gulp.src(`${outDir}/frontend/bundle.js`)
    .pipe(clean());
});

gulp.task("htmlm", ["jsd3"], function() { // минификация html
  return gulp.src(`${outDir}/backend/urls/**/*.html`)
    .pipe(env.production(htmlmin({
      collapseWhitespace: true
      ,collapseBooleanAttributes: true
      ,collapseInlineTagWhitespace: true
      ,decodeEntities: true
      ,minifyCSS: true
      ,minifyJS: true
      ,removeAttributeQuotes: true
      ,removeComments: true
      ,removeRedundantAttributes: true
      ,removeScriptTypeAttributes: true
      ,removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest(`${outDir}/backend/urls`));
});

gulp.task("copy", ["rm"], function() {  // копирование "статики"
  return gulp.src(["./backend/**", "./frontend/**", "./main.js", "./config.json"], {base:"./"})
      .pipe(gulp.dest(outDir));
});

gulp.task("devSrv", ["build"], function() { // отладочный сервер
  var srv = gls("main.js", { cwd: outDir });
  srv.start();
  // яваскрипт бэкенда
  var w1 = gulp.watch(`./backend/**/*.js`, function() {
    gulp.src(`./backend/**/*.js`, {base:"./"})
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        srv.stop();
        srv.start();
        console.log("server restarted");
      });
  });
  // вьюхи
  var w2 = gulp.watch([`./backend/urls/**/*.html`], function() {
    gulp.src(`./backend/urls/**/*.html`, {base:"./"})
      .pipe(gulp.dest(outDir))
      .pipe(srv.notify());
  });
  // сасс сайта
  var w3 = gulp.watch([`./src/frontend/css/*.scss`], function(){
    gulp.src(`./src/frontend/css/*.scss`)
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css`))
      .pipe(srv.notify());
  });
  // стили сайта 4-ой версии. нужны пока не переделали все внутренние страницы
  var w4 = gulp.watch([`./src/frontend/css/old/*.scss`], function(){
    gulp.src(`./src/frontend/css/old/*.scss`)
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css/old`))
      .pipe(srv.notify());
  });
});

// инсталяция продакшен модулей для релизной сборки
gulp.task("prodmods", ["htmlm"], function() {
  if(env.production()) {
    return gulp.src('./package.json')
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        // инсталлируем только dependency пакеты в папку с билдом
        exec("npm i --only=prod", {cwd:outDir}, () => {});
      });
  }
});

// так как галп 3.9 не может вменяемо исполнять последовательные задачи,
// весь этот код (пока что?) не нужен
gulp.task("build", ["prodmods"]);
  // "rm",       // очистка
  // "copy",     // копирование "статики"
  // "ts",       // компиляция ts
  // "sass",     // линтинг sass, создание бандла и минификация
  // "sassold",  // стили предыдущей версии сайта. используются на вложенных страницах и в библиотеке
  // "jsc",      // создание бандла js для фронтенда и его минификация
  // "jsd",      // удаление ненужных js-файлов из папки фронтенда
  // "htmlm",    // минификация и копирование html
  // "prodmods"  // копирование пакетного файла и инсталяция пакетов
  // ]);

gulp.task("run", ["build", "devSrv"]);