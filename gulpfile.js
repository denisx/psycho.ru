const gulp = require("gulp"),
  lintSass = require("gulp-sass"),
  htmlmin = require('gulp-htmlmin'),
  cleanCss = require('gulp-clean-css'),
  concatCss = require('gulp-concat-css'),
  clean = require('gulp-clean'),
  concatJs = require('gulp-concat'),
  env = require("gulp-environments"),
  uglifyJS = require('gulp-uglify'),
  gls = require('gulp-live-server'),
  exec = require('child_process').exec,
  runSequence = require('run-sequence');

// определение выходной директории в зависимости от среды исполнения
let outDir = env.production() ? "./build/psycho.ru" : "./build/debug";

gulp.task("rm", function() {  // очистка папки назначения
  return gulp.src(`${outDir}/*`).pipe(clean());
});

gulp.task("copy", function() {  // копирование "статики"
  return gulp.src(["./backend/**", "!./frontend/js/admin/**/*.js", "./frontend/**", "./main.js", "./config.json"], {base:"./"})
      .pipe(gulp.dest(outDir));
});

gulp.task("sass", function() {  // весь сасс собирается в один бандл и минифицируется
  return gulp.src("./src/frontend/css/styles.scss")
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css`));
});

gulp.task("sassold", function() { // сасс со стилями предыдущей версии сайта
  return gulp.src("./src/frontend/css/old/*.scss")
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css/old`));
});

gulp.task("jsm", function() { // костыль! js админки копируется и минифицируется отдельно
  return gulp.src("./frontend/js/admin/**/*.js")
    .pipe(env.production(uglifyJS()))
    .pipe(gulp.dest(`${outDir}/frontend/js/admin`)); // костыль! кладём бандл в кривую папку
});

gulp.task("jsc", function() {  // js фронтенда собирается в бандл и (для продакшена) минифицируется
  return gulp.src(`${outDir}/frontend/js/*.js`)
    .pipe(concatJs('bundle.js'))
    .pipe(env.production(uglifyJS()))
    .pipe(gulp.dest(`${outDir}/frontend`)); // костыль! кладём бандл в кривую папку
});

gulp.task("jsd", function() {  // удаление всего js на фронтенде, кроме бандла
  // костыль! таск разбит на 3 части
  // часть 1. очистка папки с исходными скриптами
  return gulp.src(`${outDir}/frontend/js/*.js`)
    .pipe(clean());
});

gulp.task("jsd2", function() { // костыль! копирование бандла в папку назначения
  return gulp.src(`${outDir}/frontend/bundle.js`)
    .pipe(gulp.dest(`${outDir}/frontend/js`));
});

gulp.task("jsd3", function() {  // костыль! удаление бандла из временной папки
  return gulp.src(`${outDir}/frontend/bundle.js`)
    .pipe(clean());
});

gulp.task("htmlm", function() { // минификация html
  return gulp.src(`${outDir}/backend/urls/**/*.html`)
    .pipe(env.production(htmlmin({
      collapseWhitespace: true
      ,decodeEntities: true
      ,minifyCSS: true
      ,minifyJS: true
      ,removeAttributeQuotes: true
      ,removeComments: true
      // ,removeRedundantAttributes: true
      ,removeScriptTypeAttributes: true
      ,removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest(`${outDir}/backend/urls`));
});

gulp.task("srv", function() { // отладочный сервер
  var srv = gls("main.js", { cwd: outDir });
  srv.start();
  // яваскрипт бэкенда
  var w1 = gulp.watch(`./backend/**/*.js`, function(e) {
    gulp.src(e.path, {base:"./"})
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        srv.stop();
        srv.start();
        console.log("server restarted");
      });
  });
  // main.js
  var w3 = gulp.watch([`./main.js`], function(e) {
    gulp.src('main.js')
      .pipe(gulp.dest(`${outDir}`))
      .on("finish", () => {
        srv.stop();
        srv.start();
        console.log("server restarted");
      });
  });
  // вьюхи
  var w2 = gulp.watch([`./backend/urls/**/*.html`], function(e) {
    gulp.src(e.path, {base:"./"})
      .pipe(gulp.dest(outDir))
      .pipe(srv.notify());
  });
  // сасс сайта
  var w3 = gulp.watch([`./src/frontend/css/**/*.scss`], function(){
    gulp.src(`./src/frontend/css/styles.scss`)
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
  var w5 = gulp.watch([`./frontend/js/admin/**/*.js`], function(e){
    gulp.src(e.path, {base: './frontend/js/admin'})
    .pipe(gulp.dest(`${outDir}/frontend/js/admin`));
  });
});

// инсталяция продакшен модулей для релизной сборки
gulp.task("prodmods", function() {
  if(env.production()) {
    return gulp.src('./package.json')
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        // инсталлируем только dependency пакеты в папку с билдом
        exec("npm i --only=prod", {cwd:outDir}, () => {});
      });
  }
});

gulp.task('build', () => {
  runSequence(
    'rm',
    'copy',
    'sass',
    'sassold',
    'jsc',
    'jsd',
    'jsd2',
    'jsd3',
    'jsm',
    'htmlm',
    'prodmods'
  );
});

gulp.task('default', () => {
  runSequence(
    'rm',
    'copy',
    'sass',
    'sassold',
    'jsc',
    'jsd',
    'jsd2',
    'jsd3',
    'jsm',
    'htmlm',
    'prodmods',
    'srv'
  );
});
