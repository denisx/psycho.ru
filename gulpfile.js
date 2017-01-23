// подключение модулей
var gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,sass = require("gulp-sass")
  ,envs = require("gulp-environments")
  ,clean = require('gulp-clean')
  ,gls = require('gulp-live-server');

// переменные
var dirBuild = envs.production() ? "./release" : "./debug"
  ,globStatic = "./frontend/static/**/*"
  ,globSass = "./frontend/sass/*.scss"
  ,globViews = ["./views/**"]
  ,globTS = ["./*.ts"]
  ,tsconfig = gulpts.createProject("tsconfig.json");

aClean = () => { return gulp.src(dirBuild, {read: false}).pipe(clean()); }
aStatic = (_glob) => { return gulp.src(_glob).pipe(gulp.dest(dirBuild)); }
aSass = (_glob) => {
  return gulp.src(_glob)
    .pipe(sass())
    .pipe(gulp.dest(dirBuild + "/css"));
}
aEct = (_glob) => { return gulp.src(_glob).pipe(gulp.dest(dirBuild + "/views")); }
aTsbe = (_glob) => {
  return gulp.src(_glob)
    .pipe(tsconfig())
    .pipe(gulp.dest(dirBuild));
}
aServer = () => {
  var srv = gls("main.js", { cwd: "./debug" }).start();
  gulp.watch(globSass, (e) => { aSass(e.path).pipe(srv.notify()); });
  gulp.watch(globStatic, (e) => { aStatic(e.path).pipe(srv.notify()); });
  gulp.watch(globViews, (e) => { aStatic(e.path).pipe(srv.notify()); });
  gulp.watch(globTS, (e) => { aStatic(e.path).on("finish", srv.start.bind(srv)); });
}

// режим отладки: очистка debug и компиляция всего, запуск сервера
gulp.task("debug", () => {
  aClean().on("finish", () => {
    aStatic(globStatic).on("finish", () => {
      aSass(globSass).on("finish", () => {
        aEct(globViews).on("finish", () => {
          aTsbe(globTS).on("finish", aServer);
        });
      });
    });
  });
});
