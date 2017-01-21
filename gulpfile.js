var gulp = require("gulp");
var gulpts = require("gulp-typescript");

var tsconfig = gulpts.createProject("tsconfig.json");

gulp.task("ts", function() {
  return gulp.src("*.ts")
    .pipe(tsconfig())
    .pipe(gulp.dest("build"));
});
