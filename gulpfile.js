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

function rm() { // очистка папки назначения
  return gulp.src(`${outDir}/*`).pipe(clean());
}

function sass() { // весь сасс собирается в один бандл и минифицируется
  return gulp.src("./src/frontend/css/*.scss")
      .pipe(lintSass())
      .pipe(concatCss("bundle.css"))
      .pipe(cleanCss())
      .pipe(gulp.dest(`${outDir}/frontend/css`));
}

function ts() { // ts компилируется и копируется с сохранением вложенности пути
  return gulp.src("./src/**/*.ts")
      .pipe(gulpts.createProject("tsconfig.json")())
      .pipe(gulp.dest(outDir));
}

function jsc() { // js фронтенда собирается в бандл и (для продакшена) минифицируется
  return gulp.src(`${outDir}/frontend/js/*.js`)
    .pipe(concatJs('bundle.js'))
    .pipe(env.production(uglifyJS()))
    .pipe(gulp.dest(`${outDir}/frontend/js`));
}

function jsd() { // удаление всего js на фронтенда, кроме бандла
  return gulp.src([`${outDir}/frontend/js/*.js`, `!${outDir}/frontend/js/bundle.js`])
    .pipe(clean());
}

function htmlm() { // минификация и копирование html
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
}

function copy () { // копирование различной "статики"
  return gulp.src(["./backend/**", "./frontend/**", "./main.js", "./config.json"], {base:"./"})
      .pipe(gulp.dest(outDir));
  next();
}

function devSrv() { // сервер для отладки приложения
  var srv = gls("main.js", { cwd: outDir });
  srv.start();
  var w1 = gulp.watch(`./backend/**/*.js`);
  w1.on("all", () => {
    gulp.src(`./backend/**/*.js`, {base:"./"})
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        // srv.start.bind(srv);
        srv.stop();
        srv.start();
        console.log("server restarted");
      });
  });
  var w2 = gulp.watch([`./backend/urls/**/*.html`]);
  w2.on("all", () => {
    gulp.src(`./backend/urls/**/*.html`, {base:"./"})
      .pipe(gulp.dest(outDir))
      .pipe(srv.notify());
  });
}

function prodmods(next) { // копирование пакетного файла и инсталяция prod-пакетов
  if(env.production()) {
    gulp.src('./package.json')
      .pipe(gulp.dest(outDir))
      .on("finish", () => {
        // инсталлируем только dependency пакеты в папку с билдом
        exec("npm i --only=prod", {cwd:outDir}, () => {});
      });
  }
  next();
}

gulp.task("build", gulp.series(
  rm,       // очистка
  copy,     // копирование "статики"
  ts,       // компиляция ts
  sass,     // линтинг sass, создание бандла и минификация
  jsc,      // создание бандла js для фронтенда и его минификация
  jsd,      // удаление ненужных js-файлов из папки фронтенда
  htmlm,    // минификация и копирование html
  prodmods  // копирование пакетного файла и инсталяция пакетов
));

gulp.task("run", gulp.series("build", devSrv));