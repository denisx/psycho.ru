var gulp = require("gulp")
  ,gulpts = require("gulp-typescript")
  ,nodemon = require("gulp-nodemon");

// применение глобального конфига TypeSCript
var tsconfig = gulpts.createProject("tsconfig.json");

gulp.task("watch", function() {
  gulp.watch("./*.ts", ["ts"]);
  gulp.watch("./views/**", ["views"]);
});

gulp.task("ts", function() {
  return gulp.src("./*.ts")
    .pipe(tsconfig())
    .pipe(gulp.dest("./build"));
});

gulp.task("views", function() {
  return gulp.src("./views/**")
    .pipe(gulp.dest("./build/views"));
});

gulp.task("server", ["build"], function() {
  return nodemon({
  ignore: ["./node_modules/", "./build/"]
  ,ext: "ect ts"
  ,script: './build/main.js'
  ,env: { 'NODE_ENV': 'development' }
  })
});

gulp.task("build", ["ts", "views"]);

// gulp.task("default", ["watch"]);
