let gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,sass = require("gulp-sass")
  ,envs = require("gulp-environments")
  ,clean = require('gulp-clean')
  ,concat = require('gulp-concat')
  ,filter = require('gulp-filter')
  ,uglifyJS = require('gulp-uglify')
  ,cleanCSS = require('gulp-clean-css')
  ,htmlmin = require('gulp-htmlmin')
  ,concatCss = require('gulp-concat-css')
  ,exec = require('child_process').exec
  ,gls = require('gulp-live-server');

let dirDebug = "./_debug"
  ,dirRelease = "./_release"
  ,outDir = envs.production() ? dirRelease : dirDebug
  ,tsCompiler = gulpts.createProject("tsconfig.json")
  ,globCSS = "./css/*.scss"
  ,globHTML = ["./html/*.html"]
  ,globTS = ["./js/*.ts", "./*.ts"];

function doClean() {
  return gulp.src(outDir, {read: false}).pipe(clean());
}

function compileTS() {
  return gulp.src(globTS, {base: './'})
    .pipe(tsCompiler())
    .pipe(gulp.dest(outDir));
}

function compileSass() {
  return gulp.src(globCSS)
    .pipe(sass())
    .pipe(concatCss("bundle.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(outDir + "/css"));
}

function concatJS() {
  // суть:  в папке JS конкатенируем все файлы, в случае продакшена сжимаем
  //        и удаляем все кроме полученного бандла
  // для этого используется пакет с фильтрами
  let f = filter(['**', '!**/bundle.js'], {restore:true});
  return gulp.src(outDir + "/js/*.js")
    // применяем фильтр
    .pipe(f)
    .pipe(concat('bundle.js'))
    .pipe(envs.production(uglifyJS()))
    .pipe(gulp.dest(outDir + "/js"))
    // сбрасываем фильтр, чтобы вернуть в стрим начальные файлы
    .pipe(f.restore)
    // снова фильтруем, чтобы сохранить бандл
    .pipe(f)
    .pipe(clean());
}

function copyStatic() {
  return gulp.src([
        globCSS,
        "./fonts/**",
        "./js/*.js",
        "./media/**",
        "./env_development.json"], { base: './' })
    .pipe(gulp.dest(outDir));
}

function minifyHTML() {
  return gulp.src(globHTML, {base:'./'})
    .pipe(htmlmin({
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
    }))
    .pipe(gulp.dest(outDir));
}

function devServer() {
  var srv = gls("main.js", { cwd: dirDebug });
  srv.start();
  gulp.watch(globCSS, (e) => { aSass(e.path).pipe(srv.notify()); });
  gulp.watch(globHTML, (e) => { aStatic(e.path).pipe(srv.notify()); });
  gulp.watch(globTS, (e) => { aStatic(e.path).on("finish", srv.start.bind(srv)); });
}

// универсальный таск билда приложения
gulp.task("build", () => {
  doClean().on("finish", () => {
    copyStatic().on("finish", () => {
      compileTS().on("finish", () => {
        concatJS().on("finish", () => {
          compileSass().on("finish", () => {
            minifyHTML().on("finish", () => {
              if(envs.development()) {
                // для dev-среды запускаем сервер 
                devServer();
              }
              else if(envs.production()) {
                // для продакшена копируем пакетный файл приложения
                gulp.src('./package.json')
                  .pipe(gulp.dest(outDir))
                  .on("finish", () => {
                    // инсталлируем только dependency пакеты в папку с билдом
                    exec("npm i --only=prod", {cwd:outDir}, () => {
                      console.log(process.stderr);
                    });
                  });
              }
            });
          });
        });
      });
    });
  });
});

// таск-костыль для смены директории на релизную
gulp.task("prod-outDir", () => { outDir = dirRelease; });

// 2-ой таск-костыль с установкой продакшен окружения
gulp.task("set-prod", ["prod-outDir"], envs.production.task);

// таск для билда релизной версии приложения в dev-среде
gulp.task("release", ["set-prod", "build"]);